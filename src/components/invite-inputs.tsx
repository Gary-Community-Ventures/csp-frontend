import { Text, useText } from '@/translations/wrapper'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { FormErrorMessage } from './form-error'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { LANGUAGES, type Language } from '@/translations/wrapper'
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
          <Select
            value={formData.lang}
            onValueChange={(value) => {
              if (!LANGUAGES.includes(value as Language)) {
                return
              }

              setLang(value as Language)
            }}
          >
            <SelectTrigger id="invite-provider-lang-select" className="w-full">
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
    </>
  )
}
