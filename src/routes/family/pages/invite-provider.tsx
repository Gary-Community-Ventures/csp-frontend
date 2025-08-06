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
import { Input } from '@/components/ui/input'
import { useValidateForm } from '@/lib/schemas'
import { useState } from 'react'
import { FormErrorMessage } from '@/components/form-error'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function InviteProviderPage() {
  const t = translations.family.inviteProviderPage
  const text = useText()
  const { lang } = useLanguageContext()
  const { context } = useMatch({ from: '__root__' })
  const navigate = useNavigate()
  const { children, selectedChildInfo } = useFamilyContext()
  const [submitting, setSubmitting] = useState(false)

  const schema = z.object({
    email: z.string().email({ message: text(t.emailError) }),
    phone: z
      .string()
      .transform((val) => val.replace(/\D/g, ''))
      .refine((val) => val.length === 0 || val.length === 10, {
        message: text(t.phoneError),
      }),
    children: z.array(z.number()),
    lang: z.enum(LANGUAGES),
  })

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
        <div className="flex flex-col gap-3">
          <div>
            <Label htmlFor="invite-provider-email-input">
              <Text text={t.emailLabel} />
            </Label>
            <Input
              type="email"
              id="invite-provider-email-input"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => {
                  return { ...prev, email: e.target.value }
                })
              }
            />
            <FormErrorMessage error={getError('email')} />
          </div>
          <div>
            <Label htmlFor="invite-provider-phone-input">
              <Text text={t.phoneLabel} />
            </Label>
            <Input
              type="tel"
              id="invite-provider-phone-input"
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => {
                  return { ...prev, phone: e.target.value }
                })
              }
            />
            <FormErrorMessage error={getError('phone')} />
          </div>
          <div>
            <Label htmlFor="invite-provider-lang-select">
              <Text text={t.langLabel} />
            </Label>
            <Select
              value={formData.lang}
              onValueChange={(value) => {
                if (!LANGUAGES.includes(value as Language)) {
                  return
                }

                setFormData((prev) => {
                  return { ...prev, lang: value as Language }
                })
              }}
            >
              <SelectTrigger
                id="invite-provider-lang-select"
                className="w-full"
              >
                <SelectValue placeholder={text(t.langPlaceholder)} />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {text(t.languageOptions[lang])}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
          type="submit"
          className="mt-10 mb-3 w-full"
          disabled={submitting}
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
  childIds: number[],
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
