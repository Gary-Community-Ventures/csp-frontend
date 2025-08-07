import {
  DEFAULT_LANGUAGE,
  LANGUAGE_NAMES,
  LANGUAGES,
  type Language,
} from '@/translations/wrapper'
import { Logo } from './logo'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { useLanguageContext } from '@/translations/wrapper'

export function DefaultHeader() {
  const { lang, setLang } = useLanguageContext()

  return (
    <div className="flex items-center justify-between p-5">
      <Logo variant="color" />
      <Select
        value={lang}
        onValueChange={(value) => {
          if (LANGUAGES.includes(value as Language)) {
            setLang(value as Language)
          }
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder={LANGUAGE_NAMES[DEFAULT_LANGUAGE]} />
        </SelectTrigger>
        <SelectContent>
          {LANGUAGES.map((lang) => (
            <SelectItem key={lang} value={lang}>
              {LANGUAGE_NAMES[lang]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
