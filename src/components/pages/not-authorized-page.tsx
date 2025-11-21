import { Header } from '../header'
import { Text } from '@/translations/wrapper'
import { translations } from '@/translations/text'
import { ExternalLink } from '../external-link'

export const NotAuthorizedPage = () => {
  const t = translations.general.notAuthorizedPage

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <Header Tag="h1">
        <Text text={t.title} />
      </Header>
      <p className="mb-8 text-lg text-muted-foreground">
        <Text text={t.message} />
      </p>
      <ExternalLink
        href="https://www.capcolorado.org"
        className="text-primary underline hover:text-primary/80"
      >
        <Text text={t.link} />
      </ExternalLink>
    </div>
  )
}
