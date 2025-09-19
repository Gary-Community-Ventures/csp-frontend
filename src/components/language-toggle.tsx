import { useLanguageContext } from '@/translations/wrapper'
import { LanguageSelect } from './language-select'

export function LanguageToggle() {
  const { lang, setLang } = useLanguageContext()

  return (
    <div className="absolute top-4 right-4 z-50">
      <LanguageSelect
        value={lang}
        onValueChange={setLang}
        showIcon={true}
        className="w-auto bg-white/80 backdrop-blur-sm border shadow-sm hover:bg-white/90"
        align="end"
      />
    </div>
  )
}
