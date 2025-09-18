import { Button } from '@/components/ui/button'
import { useLanguageContext, LANGUAGE_NAMES } from '@/translations/wrapper'

export function LanguageToggle() {
  const { lang, setLang } = useLanguageContext()

  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'es' : 'en')
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="absolute top-4 right-4 z-50 bg-white/80 backdrop-blur-sm border shadow-sm hover:bg-white/90 cursor-pointer"
    >
      {LANGUAGE_NAMES[lang === 'en' ? 'es' : 'en']}
    </Button>
  )
}