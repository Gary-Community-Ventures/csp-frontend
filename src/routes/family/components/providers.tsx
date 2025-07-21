import { Button } from '@/components/ui/button'
import { useFamilyContext, type Provider } from '../wrapper'
import { Badge } from '@/components/ui/badge'
import { Link } from '@tanstack/react-router'
import { CardList } from '@/components/card-list'

type PayButtonProps = {
  provider: Provider
}

function PayButton({ provider }: PayButtonProps) {
  if (provider.status === 'pending') {
    return <Badge variant="destructive">Pending</Badge>
  } else if (provider.status === 'denied') {
    return <Badge variant="destructive">Denied</Badge>
  }

  return (
    <Button asChild>
      {/* TODO: Add payment link */}
      <Link to="/family/providers">Pay Provider</Link>
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
