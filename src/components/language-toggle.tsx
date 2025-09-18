import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  useLanguageContext,
  LANGUAGE_NAMES,
  LANGUAGES,
  type Language,
} from '@/translations/wrapper'
import { Languages } from 'lucide-react'

export function LanguageToggle() {
  const { lang, setLang } = useLanguageContext()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 z-50 bg-white/80 backdrop-blur-sm border shadow-sm hover:bg-white/90 cursor-pointer"
        >
          <Languages className="h-4 w-4 mr-2" />
          {LANGUAGE_NAMES[lang]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={lang}
          onValueChange={(value) => {
            if (LANGUAGES.includes(value as Language)) {
              setLang(value as Language)
            }
          }}
        >
          {LANGUAGES.map((language) => (
            <DropdownMenuRadioItem key={language} value={language}>
              {LANGUAGE_NAMES[language]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
