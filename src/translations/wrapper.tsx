import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from 'react'

export type DefaultLanguage = 'en'
export type Language = 'en' | 'es'

export const DEFAULT_LANGUAGE: DefaultLanguage = 'en'
export const LANGUAGES: Language[] = ['en', 'es']

export type LanguageContextType = {
  lang: Language
  setLang: Dispatch<SetStateAction<Language>>
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
)

export function LanguageWrapper({ children }: PropsWithChildren) {
  const storedLang = localStorage.getItem('lang')

  let initialLang: Language = DEFAULT_LANGUAGE
  if (LANGUAGES.includes(storedLang as Language)) {
    initialLang = storedLang as Language
  }

  const [lang, setLang] = useState<Language>(initialLang)

  useEffect(() => {
    localStorage.setItem('lang', lang)
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguageContext(): LanguageContextType {
  const context = useContext(LanguageContext)

  if (context === undefined) {
    throw new Error("'useLanguageContext' must be used within the Wrapper")
  }

  return context
}

export type TranslatableText = Partial<Record<Language, string>> &
  Record<DefaultLanguage, string>

export function useText() {
  const { lang } = useLanguageContext()

  return (text: TranslatableText) => {
    if (text[lang] === undefined) {
      return text[DEFAULT_LANGUAGE]
    }

    return text[lang]
  }
}

type TextProps = {
  text: TranslatableText
}

export function Text({ text }: TextProps) {
  const textFunc = useText()

  return textFunc(text)
}
