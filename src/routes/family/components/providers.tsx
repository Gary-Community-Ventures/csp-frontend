import { Button } from '@/components/ui/button'
import { useFamilyContext, type Provider } from '../wrapper'
import { Badge } from '@/components/ui/badge'
import { Link } from '@tanstack/react-router'
import { CardList } from '@/components/card-list'
import { Text } from '@/translations/wrapper'
import { translations } from '@/translations/text'
import { WhiteCard } from '@/components/white-card'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { useState, type ReactNode } from 'react'
import { ExternalLink } from '@/components/external-link'
import { COLORADO_SHINES_URL } from '@/lib/constants'

type PayButtonProps = {
  provider: Provider
}

function PayButton({ provider }: PayButtonProps) {
  const t = translations.family.providerList
  const { selectedChildInfo, attendanceDue, canMakePayments } =
    useFamilyContext()
  const [isOpen, setIsOpen] = useState(false)

  // Determine button state and disabled reason
  let buttonContent: ReactNode
  let disabledReason:
    | (typeof t.disabledReasons)[keyof typeof t.disabledReasons]
    | null = null

  if (provider.status === 'pending' || provider.status === 'denied') {
    // Provider not active - show badge
    buttonContent = (
      <Badge variant="destructive" className="cursor-help">
        <Text text={provider.status === 'pending' ? t.pending : t.denied} />
      </Badge>
    )
    disabledReason = t.disabledReasons.providerNotActive
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
      ? t.disabledReasons.childPaymentDisabled
      : t.disabledReasons.providerPaymentDisabled
  } else if (!provider.isPayable || !canMakePayments) {
    // Cannot make payment - show disabled button
    buttonContent = (
      <div className="inline-block">
        <Button disabled>
          <Text text={t.payProvider} />
        </Button>
      </div>
    )
    disabledReason = !canMakePayments
      ? t.disabledReasons.accountIssue
      : t.disabledReasons.providerNotConfigured
  } else if (provider.attendanceIsOverdue) {
    buttonContent = (
      <div className="inline-block">
        <Button disabled>
          <Text text={t.payProvider} />
        </Button>
      </div>
    )

    if (attendanceDue) {
      disabledReason = t.disabledReasons.familyAttendanceOverdue
    } else {
      disabledReason = t.disabledReasons.providerAttendanceOverdue
    }
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
  if (disabledReason) {
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setIsOpen(!isOpen)
      }
    }

    return (
      <HoverCard
        open={isOpen}
        onOpenChange={setIsOpen}
        openDelay={100}
        closeDelay={100}
      >
        <HoverCardTrigger asChild>
          <div
            role="button"
            tabIndex={0}
            onClick={() => setIsOpen(!isOpen)}
            onKeyDown={handleKeyDown}
            className="inline-block"
          >
            {buttonContent}
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="max-w-xs w-auto p-3 text-sm text-center">
          <Text text={disabledReason} />
        </HoverCardContent>
      </HoverCard>
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
