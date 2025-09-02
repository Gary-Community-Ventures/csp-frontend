import { CardList } from '@/components/card-list'
import { WhiteCard } from '@/components/white-card'
import { Button } from '@/components/ui/button'
import { Text } from '@/translations/wrapper'
import { translations } from '@/translations/text'
import { useFormatDate } from '@/lib/dates'
import { Link } from '@tanstack/react-router'
import { Settings } from 'lucide-react'
import type {
  FamilyPaymentHistoryItem,
  ProviderPaymentHistoryItem,
} from '@/lib/api/paymentHistory'

import { formatAmount } from '@/lib/currency'

type PaymentAmountProps = {
  amountCents: number
}

function FamilyPaymentAmount({ amountCents }: PaymentAmountProps) {
  return (
    <span className="font-bold text-red-600">-{formatAmount(amountCents)}</span>
  )
}

function ProviderPaymentAmount({ amountCents }: PaymentAmountProps) {
  return (
    <span className="font-bold text-green-600">
      +{formatAmount(amountCents)}
    </span>
  )
}
export type FamilyPaymentsListProps = {
  payments: FamilyPaymentHistoryItem[]
}

export type ProviderPaymentsListProps = {
  payments: ProviderPaymentHistoryItem[]
  isPayable: boolean
  isPaymentEnabled: boolean
}

export function FamilyPaymentsList({ payments }: FamilyPaymentsListProps) {
  const formatDate = useFormatDate()

  if (payments.length < 1) {
    return (
      <WhiteCard Tag="ul" className="py-8">
        <div className="flex flex-col items-center justify-center text-muted-foreground text-center">
          <p className="text-lg font-semibold mb-2">
            <Text text={translations.general.emptyState.noPaymentsTitle} />
          </p>
          <p className="text-sm">
            <Text
              text={translations.general.emptyState.noFamilyPaymentsDescription}
            />
          </p>
        </div>
      </WhiteCard>
    )
  }

  return (
    <CardList
      items={payments.map((payment) => (
        <div
          className="flex justify-between items-start gap-4"
          key={payment.payment_id}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <strong className="text-lg truncate">
                {payment.provider_name}
              </strong>
            </div>
            <div className="text-muted-foreground text-sm space-y-1">
              <div>{formatDate(new Date(payment.created_at))}</div>
              <div>
                <Text
                  text={translations.general.paymentHistory.fromAllocationMonth}
                />
                : {payment.month}
              </div>
            </div>
          </div>
          <div className="text-right">
            <FamilyPaymentAmount amountCents={payment.amount_cents} />
          </div>
        </div>
      ))}
    />
  )
}

export function ProviderPaymentsList({
  payments,
  isPayable,
  isPaymentEnabled,
}: ProviderPaymentsListProps) {
  const formatDate = useFormatDate()

  if (payments.length < 1) {
    return (
      <WhiteCard Tag="ul" className="py-8">
        <div className="flex flex-col items-center justify-center text-muted-foreground text-center space-y-4">
          <div>
            <p className="text-lg font-semibold mb-2">
              <Text text={translations.general.emptyState.noPaymentsTitle} />
            </p>
            <p className="text-sm">
              <Text
                text={
                  translations.general.emptyState.noProviderPaymentsDescription
                }
              />
            </p>
          </div>
          {!isPayable && isPaymentEnabled && (
            <Button variant="outline" asChild>
              <Link to="/provider/payment-settings">
                <Settings className="size-4" />
                <Text
                  text={
                    translations.provider.paymentSettings.setupPaymentButton
                  }
                />
              </Link>
            </Button>
          )}
        </div>
      </WhiteCard>
    )
  }

  return (
    <CardList
      items={payments.map((payment) => (
        <div
          className="flex justify-between items-start gap-4"
          key={payment.payment_id}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <strong className="text-lg truncate">{payment.child_name}</strong>
            </div>
            <div className="text-muted-foreground text-sm space-y-1">
              <div>{formatDate(new Date(payment.created_at))}</div>
              <div>
                <Text
                  text={translations.general.paymentHistory.paymentMethod}
                />
                : {payment.payment_method.toUpperCase()}
              </div>
            </div>
          </div>
          <div className="text-right">
            <ProviderPaymentAmount amountCents={payment.amount_cents} />
          </div>
        </div>
      ))}
    />
  )
}
