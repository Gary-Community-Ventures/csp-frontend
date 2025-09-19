import { Text, useText } from '@/translations/wrapper'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { FormErrorMessage } from './form-error'
import { LanguageSelect } from './language-select'
import { type Language } from '@/translations/wrapper'
import { translations } from '@/translations/text'

type FormData = {
  email: string
  phone: string
  lang: Language
}

type InviteInputsProps = {
  formData: FormData
  setEmail: (email: string) => void
  setPhone: (phone: string) => void
  setLang: (lang: Language) => void
  emailError: string | undefined
  phoneError: string | undefined
}

export function InviteInputs({
  formData,
  setEmail,
  setPhone,
  setLang,
  emailError,
  phoneError,
}: InviteInputsProps) {
  const t = translations.general.inviteInputs
  const text = useText()

  return (
    <>
      <div className="flex flex-col gap-3">
        <div>
          <Label htmlFor="invite-provider-email-input">
            <Text text={t.emailLabel} />
          </Label>
          <Input
            type="email"
            id="invite-provider-email-input"
            value={formData.email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormErrorMessage error={emailError} />
        </div>
        <div>
          <Label htmlFor="invite-provider-phone-input">
            <Text text={t.phoneLabel} />
          </Label>
          <Input
            type="tel"
            id="invite-provider-phone-input"
            value={formData.phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <FormErrorMessage error={phoneError} />
        </div>
        <div>
          <Label htmlFor="invite-provider-lang-select">
            <Text text={t.langLabel} />
          </Label>
          <LanguageSelect
            value={formData.lang}
            onValueChange={setLang}
            placeholder={text(t.langPlaceholder)}
            className="w-full"
            id="invite-provider-lang-select"
          />
        </div>
      </div>
    </>
  )
}
