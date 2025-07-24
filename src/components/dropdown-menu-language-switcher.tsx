import { Languages } from 'lucide-react'
import {
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from './ui/dropdown-menu'
import {
  LANGUAGES,
  LOCALE_NAMES,
  Text,
  useLanguageContext,
  type Language,
} from '@/translations/wrapper'
import { translations } from '@/translations/text'

export function DropdownMenuLanguageSwitcher() {
  const t = translations.lanuageSwitcher
  const { lang, setLang } = useLanguageContext()

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <Languages />
        <Text text={t.languages} />
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuRadioGroup
            value={lang}
            onValueChange={(value) => {
              if (LANGUAGES.includes(value as Language)) {
                setLang(value as Language)
              }
            }}
          >
            {LANGUAGES.map((lang) => (
              <DropdownMenuRadioItem key={lang} value={lang}>
                {LOCALE_NAMES[lang]}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  )
}
