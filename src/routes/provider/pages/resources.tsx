import { Header } from '@/components/header'
import { Text, useText } from '@/translations/wrapper'
import { translations } from '@/translations/text'
import { ExternalLink } from '@/components/external-link'
import { Button } from '@/components/ui/button'

export function ResourcesPage() {
  const t = translations.provider.resources
  const text = useText()

  return (
    <div className="p-5 mb-5">
      <Header Tag="h1" className="text-center">
        <Text text={t.title} />
      </Header>
      <p className="text-center">
        <Text text={t.description} />
      </p>
      <div className="text-center pt-3">
        <Button asChild>
          <ExternalLink href={text(t.getStartedLink)}>
            <Text text={t.getStarted} />
          </ExternalLink>
        </Button>
      </div>
    </div>
  )
}
