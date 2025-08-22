import { Header } from '@/components/header'
import {
  LANGUAGES,
  Text,
  useLanguageContext,
  useText,
  type Language,
} from '@/translations/wrapper'
import { translations } from '@/translations/text'
import z from 'zod'
import { Label } from '@/components/ui/label'
import { useValidateForm, useZodSchema } from '@/lib/schemas'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Link, useMatch, useNavigate } from '@tanstack/react-router'
import {
  backendUrl,
  handleStatusCodes,
  headersWithAuth,
} from '@/lib/api/client'
import type { RouterContext } from '@/routes/router'
import { useFamilyContext } from '../wrapper'
import { Checkbox } from '@/components/ui/checkbox'
import { InviteInputs } from '@/components/invite-inputs'

export function InviteProviderPage() {
  const t = translations.family.inviteProviderPage
  const text = useText()
  const { lang } = useLanguageContext()
  const { context } = useMatch({ from: '__root__' })
  const navigate = useNavigate()
  const { children, selectedChildInfo } = useFamilyContext()
  const [submitting, setSubmitting] = useState(false)

  const schema = useZodSchema(
    z.object({
      email: z.string().email({ message: text(t.emailError) }),
      phone: z
        .string()
        .transform((val) => val.replace(/\D/g, ''))
        .refine((val) => val.length === 0 || val.length === 10, {
          message: text(t.phoneError),
        }),
      children: z.array(z.string()),
      lang: z.enum(LANGUAGES),
    })
  )

  const [formData, setFormData] = useState<z.infer<typeof schema>>({
    email: '',
    phone: '',
    children: [selectedChildInfo.id],
    lang: lang,
  })

  const { getError, submit } = useValidateForm(schema, formData)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setSubmitting(true)

    submit(
      (data) => {
        handleInviteProvider(
          data.email,
          data.phone,
          data.children,
          data.lang,
          context
        )
          .then(() => {
            navigate({
              to: '/family/$childId/providers/invite/confirmation',
              search: {
                email: data.email,
                phone: data.phone,
              },
            })
          })
          .finally(() => {
            setSubmitting(false)
          })
      },
      () => {
        setSubmitting(false)
      }
    )
  }

  return (
    <section className="p-5">
      <form onSubmit={handleSubmit}>
        <div>
          <Header Tag="h1">
            <Text text={t.childrenHeader} />
          </Header>
          {children.map((child) => {
            const id = `invite-provider-selected-child-${child.id}`

            return (
              <div key={child.id} className="flex gap-3">
                <Checkbox
                  id={id}
                  className="my-3"
                  checked={formData.children.includes(child.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFormData((prev) => {
                        return {
                          ...prev,
                          children: [...prev.children, child.id],
                        }
                      })
                    } else {
                      setFormData((prev) => {
                        return {
                          ...prev,
                          children: prev.children.filter(
                            (childId) => childId !== child.id
                          ),
                        }
                      })
                    }
                  }}
                />
                <Label htmlFor={id} className="flex grow py-3">
                  {child.firstName} {child.lastName}
                </Label>
              </div>
            )
          })}
        </div>
        <Header className="py-5">
          <Text text={t.header} />
        </Header>
        <InviteInputs
          formData={formData}
          setEmail={(email) => setFormData((prev) => ({ ...prev, email }))}
          setPhone={(phone) => setFormData((prev) => ({ ...prev, phone }))}
          setLang={(lang) => setFormData((prev) => ({ ...prev, lang }))}
          emailError={getError('email')}
          phoneError={getError('phone')}
        />
        <Button
          type="submit"
          className="mt-10 mb-3 w-full"
          loading={submitting}
        >
          <Text text={t.submitButton} />
        </Button>
        <Button variant="outline" className="w-full" asChild>
          <Link to="/family/$childId/providers">
            <Text text={t.cancelButton} />
          </Link>
        </Button>
      </form>
    </section>
  )
}

async function handleInviteProvider(
  email: string,
  phone: string,
  childIds: string[],
  lang: Language,
  context: RouterContext
) {
  const res = await fetch(backendUrl('/family/invite-provider'), {
    method: 'POST',
    headers: await headersWithAuth(context),
    body: JSON.stringify({
      provider_email: email,
      provider_cell: phone === '' ? null : `+1${phone}`,
      child_ids: childIds,
      lang: lang,
    }),
  })

  handleStatusCodes(context, res)
  if (!res.ok) {
    throw new Error(`Failed to invite provider: ${res.statusText}`)
  }

  return res.json()
}
