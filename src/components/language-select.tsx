import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  LANGUAGE_NAMES,
  LANGUAGES,
  type Language,
} from '@/translations/wrapper'
import { Languages } from 'lucide-react'

type LanguageSelectProps = {
  value: Language
  onValueChange: (value: Language) => void
  showIcon?: boolean
  placeholder?: string
  className?: string
  align?: 'start' | 'center' | 'end'
  id?: string
}

export function LanguageSelect({
  value,
  onValueChange,
  showIcon = false,
  placeholder,
  className,
  align,
  id,
}: LanguageSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(selectedValue) => {
        if (LANGUAGES.includes(selectedValue as Language)) {
          onValueChange(selectedValue as Language)
        }
      }}
    >
      <SelectTrigger id={id} className={className}>
        {showIcon && <Languages className="h-4 w-4 mr-2" />}
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent align={align}>
        {LANGUAGES.map((language) => (
          <SelectItem key={language} value={language}>
            {LANGUAGE_NAMES[language]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
