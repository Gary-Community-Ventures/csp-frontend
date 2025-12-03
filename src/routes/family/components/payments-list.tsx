import { CardList } from '@/components/card-list'
import { WhiteCard } from '@/components/white-card'
import { Text } from '@/translations/wrapper'
import { translations } from '@/translations/text'
import { useFormatDate } from '@/lib/dates'
import type { FamilyPaymentHistoryItem } from '@/lib/api/paymentHistory'
import { useLanguageContext } from '@/translations/wrapper'
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
  const formatDate = useFormatDate()
  const { lang } = useLanguageContext()

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
      items={payments.map((payment) => {
        const hasCaredays =
          payment.payment_type === 'care_days' &&
          payment.care_days &&
          payment.care_days.length > 0
        const hasPartialPayments = payment.care_days?.some(
          (day) => day.amount_missing_cents && day.amount_missing_cents > 0
        )
        const isLumpSum = payment.payment_type === 'lump_sum'
        const isExpandable = hasCaredays || isLumpSum

        return (
          <FamilyPaymentItem
            key={payment.payment_id}
            payment={payment}
            hasCaredays={hasCaredays}
            hasPartialPayments={hasPartialPayments}
            isLumpSum={isLumpSum}
            isExpandable={isExpandable}
            formatDate={formatDate}
            lang={lang}
          />
        )
      })}
    />
  )
}

function FamilyPaymentItem({
  payment,
  hasCaredays,
  hasPartialPayments,
  isLumpSum,
  isExpandable,
  formatDate,
  lang,
}: {
  payment: FamilyPaymentHistoryItem
  hasCaredays: boolean
  hasPartialPayments: boolean
  isLumpSum: boolean
  isExpandable: boolean
  formatDate: (date: Date) => string
  lang: string
}) {
  return (
    <PaymentItem
      title={payment.provider_name}
      amountCents={payment.amount_cents}
      createdAt={payment.created_at}
      careDays={payment.care_days}
      lumpSum={payment.lump_sum}
      allocationMonth={payment.month}
      hasCaredays={hasCaredays}
      hasPartialPayments={hasPartialPayments}
      isLumpSum={isLumpSum}
      isExpandable={isExpandable}
      formatDate={formatDate}
      lang={lang}
      renderAmount={(amountCents) => (
        <FamilyPaymentAmount amountCents={amountCents} />
      )}
      amountClassName="text-gray-700"
    />
  )
}
