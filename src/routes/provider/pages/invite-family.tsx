import { Header } from '@/components/header'
import {
  LANGUAGES,
  Text,
  useLanguageContext,
  useText,
  type Language,
} from '@/translations/wrapper'
import { translations } from '@/translations/text'
import { Link, useMatch, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import z from 'zod'
import { useValidateForm } from '@/lib/schemas'
import { InviteInputs } from '@/components/invite-inputs'
import { Button } from '@/components/ui/button'
import type { RouterContext } from '@/routes/router'
import {
  backendUrl,
  handleStatusCodes,
  headersWithAuth,
} from '@/lib/api/client'

export function InviteFamilyPage() {
  const t = translations.provider.inviteFamilyPage
  const text = useText()
  const { lang } = useLanguageContext()
  const { context } = useMatch({ from: '__root__' })
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  const schema = z.object({
    email: z.string().email({ message: text(t.emailError) }),
    phone: z
      .string()
      .transform((val) => val.replace(/\D/g, ''))
      .refine((val) => val.length === 0 || val.length === 10, {
        message: text(t.phoneError),
      }),
    lang: z.enum(LANGUAGES),
  })

  const [formData, setFormData] = useState<z.infer<typeof schema>>({
    email: '',
    phone: '',
    lang: lang,
  })

  const { getError, submit } = useValidateForm(schema, formData)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setSubmitting(true)

    submit(
      (data) => {
        handleInviteFamily(data.email, data.phone, data.lang, context)
          .then(() => {
            navigate({
              to: '/provider/families/invite/confirmation',
              search: { email: data.email, phone: data.phone },
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
        <Header Tag="h1" className="pb-5">
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
          disabled={submitting}
        >
          <Text text={t.submitButton} />
        </Button>
        <Button variant="outline" className="w-full" asChild>
          <Link to="/provider/home">
            <Text text={t.cancelButton} />
          </Link>
        </Button>
      </form>
    </section>
  )
}

async function handleInviteFamily(
  email: string,
  phone: string,
  lang: Language,
  context: RouterContext
) {
  const res = await fetch(backendUrl('/provider/invite-family'), {
    method: 'POST',
    headers: await headersWithAuth(context),
    body: JSON.stringify({
      family_email: email,
      family_cell: phone === '' ? null : `+1${phone}`,
      lang: lang,
    }),
  })

  handleStatusCodes(context, res)
  if (!res.ok) {
    throw new Error(`Failed to invite family: ${res.statusText}`)
  }

  return res.json()
}
