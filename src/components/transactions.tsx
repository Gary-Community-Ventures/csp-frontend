import { CardList } from '@/components/card-list'
import { WhiteCard } from '@/components/white-card'
import { Badge } from '@/components/ui/badge'
import { Text } from '@/translations/wrapper'
import { translations } from '@/translations/text'
import { useMemo } from 'react'
import { useFormatDate } from '@/lib/dates'
import type { FamilyPaymentHistoryItem, ProviderPaymentHistoryItem } from '@/lib/api/paymentHistory'

type PaymentAmountProps = {
  amountCents: number
}

function PaymentAmount({ amountCents }: PaymentAmountProps) {
  const amount = amountCents / 100

  const formattedAmount = useMemo(() => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    })
  }, [amount])

  return (
    <span className="font-bold text-green-600">
      {formattedAmount}
    </span>
  )
}

function PaymentStatusBadge({ status }: { status: 'success' | 'failed' | 'pending' }) {
  const statusConfig = {
    success: { variant: 'default' as const, className: 'bg-green-100 text-green-800 border-green-300' },
    failed: { variant: 'destructive' as const, className: '' },
    pending: { variant: 'outline' as const, className: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  }

  const config = statusConfig[status]

  return (
    <Badge variant={config.variant} className={config.className}>
      <Text text={translations.general.paymentHistory.status[status]} />
    </Badge>
  )
}

export type FamilyPaymentsListProps = {
  payments: FamilyPaymentHistoryItem[]
}

export type ProviderPaymentsListProps = {
  payments: ProviderPaymentHistoryItem[]
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
            <Text text={translations.general.emptyState.noFamilyPaymentsDescription} />
          </p>
        </div>
      </WhiteCard>
    )
  }

  return (
    <CardList
      items={payments.map((payment) => (
        <div className="flex justify-between items-start gap-4" key={payment.payment_id}>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <strong className="text-lg truncate">{payment.provider_name}</strong>
              <PaymentStatusBadge status={payment.status} />
            </div>
            <div className="text-muted-foreground text-sm space-y-1">
              <div><Text text={translations.general.paymentHistory.child} />: {payment.child_name}</div>
              <div>{formatDate(new Date(payment.created_at))}</div>
              <div><Text text={translations.general.paymentHistory.month} />: {payment.month}</div>
            </div>
          </div>
          <div className="text-right">
            <PaymentAmount amountCents={payment.amount_cents} />
          </div>
        </div>
      ))}
    />
  )
}

export function ProviderPaymentsList({ payments }: ProviderPaymentsListProps) {
  const formatDate = useFormatDate()

  if (payments.length < 1) {
    return (
      <WhiteCard Tag="ul" className="py-8">
        <div className="flex flex-col items-center justify-center text-muted-foreground text-center">
          <p className="text-lg font-semibold mb-2">
            <Text text={translations.general.emptyState.noPaymentsTitle} />
          </p>
          <p className="text-sm">
            <Text text={translations.general.emptyState.noProviderPaymentsDescription} />
          </p>
        </div>
      </WhiteCard>
    )
  }

  return (
    <CardList
      items={payments.map((payment) => (
        <div className="flex justify-between items-start gap-4" key={payment.payment_id}>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <strong className="text-lg truncate">{payment.child_name}</strong>
              <PaymentStatusBadge status={payment.status} />
            </div>
            <div className="text-muted-foreground text-sm space-y-1">
              {payment.family_name && <div><Text text={translations.general.paymentHistory.family} />: {payment.family_name}</div>}
              <div>{formatDate(new Date(payment.created_at))}</div>
              <div><Text text={translations.general.paymentHistory.month} />: {payment.month}</div>
              <div><Text text={translations.general.paymentHistory.paymentMethod} />: {payment.payment_method}</div>
            </div>
          </div>
          <div className="text-right">
            <PaymentAmount amountCents={payment.amount_cents} />
          </div>
        </div>
      ))}
    />
  )
}

