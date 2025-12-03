import { CardList } from '@/components/card-list'
import { WhiteCard } from '@/components/white-card'
import { Text } from '@/translations/wrapper'
import { translations } from '@/translations/text'
import type { FamilyPaymentHistoryItem } from '@/lib/api/paymentHistory'
import { formatAmount } from '@/lib/currency'
import { PaymentItem } from '@/components/payment-item'

type PaymentAmountProps = {
  amountCents: number
}

function FamilyPaymentAmount({ amountCents }: PaymentAmountProps) {
  return <span>-{formatAmount(amountCents)}</span>
}

export type FamilyPaymentsListProps = {
  payments: FamilyPaymentHistoryItem[]
}

export function FamilyPaymentsList({ payments }: FamilyPaymentsListProps) {
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
        <FamilyPaymentItem key={payment.payment_id} payment={payment} />
      ))}
    />
  )
}

function FamilyPaymentItem({ payment }: { payment: FamilyPaymentHistoryItem }) {
  return (
    <PaymentItem
      title={payment.provider_name}
      amountCents={payment.amount_cents}
      createdAt={payment.created_at}
      careDays={payment.care_days}
      lumpSum={payment.lump_sum}
      allocationMonth={payment.month}
      renderAmount={(amountCents) => (
        <FamilyPaymentAmount amountCents={amountCents} />
      )}
      amountClassName="text-gray-700"
    />
  )
}
