import { Button } from '@/components/ui/button'
import { useFamilyContext, type Provider } from '../wrapper'
import { Badge } from '@/components/ui/badge'
import { Link } from '@tanstack/react-router'
import { CardList } from '@/components/card-list'
import { Text } from '@/translations/wrapper'
import { translations } from '@/translations/text'
import { WhiteCard } from '@/components/white-card'
import { ExternalLink } from '@/components/external-link'
import { COLORADO_SHINES_URL } from '@/lib/constants'

type PayButtonProps = {
  provider: Provider
}

function PayButton({ provider }: PayButtonProps) {
  const t = translations.family.providerList

  const { selectedChildInfo, canMakePayments } = useFamilyContext()

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

  if (!provider.isPaymentEnabled || !selectedChildInfo.isPaymentEnabled) {
    return (
      <Badge variant="secondary">
        <Text text={t.paymentsDisabled} />
      </Badge>
    )
  }

  if (!provider.isPayable || !canMakePayments) {
    return (
      <Button disabled>
        <Text text={t.payProvider} />
      </Button>
    )
  }

  return (
    <Button asChild>
      <Link
        to="/family/$childId/payment/$providerId"
        params={{
          childId: selectedChildInfo.id,
          providerId: provider.id,
        }}
      >
        <Text text={t.payProvider} />
      </Link>
    </Button>
  )
}

type ProviderListProps = {
  showAddProvider?: boolean
}

export function ProviderList({ showAddProvider = false }: ProviderListProps) {
  const { providers } = useFamilyContext()

  if (providers.length < 1 && showAddProvider) {
    return (
      <WhiteCard Tag="ul" className="py-8">
        <div className="flex flex-col items-center justify-center text-center">
          <p>
            <Text
              text={
                translations.general.emptyState.noProvidersAddProvider.part1
              }
            />
            <ExternalLink
              href={COLORADO_SHINES_URL}
              className="text-primary hover:text-primary/80 underline"
            >
              <Text
                text={
                  translations.general.emptyState.noProvidersAddProvider
                    .coloradoShinesText
                }
              />
            </ExternalLink>
            <Text
              text={
                translations.general.emptyState.noProvidersAddProvider.part2
              }
            />
          </p>
          <Button asChild className="mt-4" size="lg">
            <Link to="/family/$childId/providers/invite">
              <Text text={translations.general.emptyState.addYourProvider} />
            </Link>
          </Button>
        </div>
      </WhiteCard>
    )
  }

  if (providers.length < 1) {
    return (
      <WhiteCard Tag="ul" className="py-8">
        <div className="flex flex-col items-center justify-center text-muted-foreground text-center">
          <p className="text-lg font-semibold mb-2">
            <Text text={translations.general.emptyState.noProvidersTitle} />
          </p>
          <p className="text-sm">
            <Text
              text={translations.general.emptyState.noProvidersDescription}
            />
          </p>
        </div>
      </WhiteCard>
    )
  }

  return (
    <CardList
      items={providers.map((provider) => {
        return (
          <div
            className="flex justify-between items-center w-full"
            key={provider.id}
          >
            <strong className="text-lg">{provider.name}</strong>
            <PayButton provider={provider} />
          </div>
        )
      })}
    />
  )
}
