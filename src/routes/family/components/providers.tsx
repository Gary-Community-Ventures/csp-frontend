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
import type { ReactNode } from 'react'

type PayButtonProps = {
  provider: Provider
}

function PayButton({ provider }: PayButtonProps) {
  const t = translations.family.providerList
  const { selectedChildInfo, canMakePayments } = useFamilyContext()

  // Determine button state and disabled reason
  let buttonContent: ReactNode
  let disabledReason:
    | (typeof t.disabledReasons)[keyof typeof t.disabledReasons]
    | null = null
  let isDisabled = false

  if (provider.status === 'pending' || provider.status === 'denied') {
    // Provider not active - show badge
    buttonContent = (
      <Badge variant="destructive" className="cursor-help">
        <Text text={provider.status === 'pending' ? t.pending : t.denied} />
      </Badge>
    )
    disabledReason = t.disabledReasons.providerNotActive
    isDisabled = true
  } else if (
    !provider.isPaymentEnabled ||
    !selectedChildInfo.isPaymentEnabled
  ) {
    // Payments not enabled - show secondary badge
    buttonContent = (
      <Badge variant="secondary" className="cursor-help">
        <Text text={t.paymentsDisabled} />
      </Badge>
    )
    disabledReason = !selectedChildInfo.isPaymentEnabled
      ? t.disabledReasons.userPaymentDisabled
      : t.disabledReasons.providerPaymentDisabled
    isDisabled = true
  } else if (!provider.isPayable || !canMakePayments) {
    // Cannot make payment - show disabled button
    buttonContent = (
      <div className="inline-block">
        <Button disabled className="pointer-events-none">
          <Text text={t.payProvider} />
        </Button>
      </div>
    )
    disabledReason = !canMakePayments
      ? t.disabledReasons.accountIssue
      : t.disabledReasons.providerNotConfigured
    isDisabled = true
  } else {
    // Can make payment - show active button
    buttonContent = (
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

  // Render with popover if disabled
  if (isDisabled && disabledReason) {
    return (
      <Popover>
        <PopoverTrigger asChild>{buttonContent}</PopoverTrigger>
        <PopoverContent className="max-w-xs w-auto p-3 text-sm text-center">
          <Text text={disabledReason} />
        </PopoverContent>
      </Popover>
    )
  }

  return <>{buttonContent}</>
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
