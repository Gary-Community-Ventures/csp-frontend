import { Header } from '../header'
import { Text } from '@/translations/wrapper'
import { translations } from '@/translations/text'

export const OfflinePage = () => {
  const t = translations.general.offlinePage

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <Header Tag="h1">
        <Text text={t.title} />
      </Header>
      <p className="text-lg text-muted-foreground mb-8">
        <Text text={t.message} />
      </p>
    </div>
  )
}
