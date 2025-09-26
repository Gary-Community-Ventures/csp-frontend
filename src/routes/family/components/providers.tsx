import { Button } from '@/components/ui/button'
import { useFamilyContext, type Provider } from '../wrapper'
import { Badge } from '@/components/ui/badge'
import { Link } from '@tanstack/react-router'
import { CardList } from '@/components/card-list'
import { Text } from '@/translations/wrapper'
import { translations } from '@/translations/text'
import { WhiteCard } from '@/components/white-card'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

type PayButtonProps = {
  provider: Provider
}

function PayButton({ provider }: PayButtonProps) {
  const t = translations.family.providerList

  const { selectedChildInfo, canMakePayments } = useFamilyContext()

  if (provider.status === 'pending' || provider.status === 'denied') {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Badge variant="destructive" className="cursor-help">
            <Text text={provider.status === 'pending' ? t.pending : t.denied} />
          </Badge>
        </PopoverTrigger>
        <PopoverContent className="max-w-xs w-auto p-3 text-sm text-center">
          <Text text={t.disabledReasons.providerNotActive} />
        </PopoverContent>
      </Popover>
    )
  }

  if (!provider.isPaymentEnabled || !selectedChildInfo.isPaymentEnabled) {
    const disabledReason = !selectedChildInfo.isPaymentEnabled
      ? t.disabledReasons.userPaymentDisabled
      : t.disabledReasons.providerPaymentDisabled

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Badge variant="secondary" className="cursor-help">
            <Text text={t.paymentsDisabled} />
          </Badge>
        </PopoverTrigger>
        <PopoverContent className="max-w-xs w-auto p-3 text-sm text-center">
          <Text text={disabledReason} />
        </PopoverContent>
      </Popover>
    )
  }

  if (!provider.isPayable || !canMakePayments) {
    const disabledReason = !canMakePayments
      ? t.disabledReasons.accountIssue
      : t.disabledReasons.providerNotConfigured

    return (
      <Popover>
        <PopoverTrigger asChild>
          <div className="inline-block">
            <Button disabled className="pointer-events-none">
              <Text text={t.payProvider} />
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="max-w-xs w-auto p-3 text-sm text-center">
          <Text text={disabledReason} />
        </PopoverContent>
      </Popover>
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
          <Text text={translations.general.emptyState.noProvidersAddProvider} />
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
