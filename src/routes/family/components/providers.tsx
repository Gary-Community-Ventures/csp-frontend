import { Button } from '@/components/ui/button'
import { useFamilyContext, type Provider } from '../wrapper'
import { Badge } from '@/components/ui/badge'
import { Link } from '@tanstack/react-router'
import { CardList } from '@/components/card-list'
import { Text } from '@/translations/wrapper'
import { translations } from '@/translations/text'

type PayButtonProps = {
  provider: Provider
}

function PayButton({ provider }: PayButtonProps) {
  const t = translations.family.providerList

  if (provider.status === 'pending') {
    return (
      <Badge variant="destructive">
        <Text text={t.pending} />
      </Badge>
    )
  } else if (provider.status === 'denied') {
    return (
      <Badge variant="destructive">
        <Text text={t.denied} />
      </Badge>
    )
  }

  return (
    <Button asChild>
      <Link to="/family/$childId/payment" search={{ providerId: provider.id }}>
        <Text text={t.payProvider} />
      </Link>
    </Button>
  )
}

export function ProviderList() {
  const { providers } = useFamilyContext()

  return (
    <CardList
      items={providers.map((provider) => {
        return (
          <div className="flex justify-between">
            <strong className="text-lg">{provider.name}</strong>
            <PayButton provider={provider} />
          </div>
        )
      })}
    />
  )
}
