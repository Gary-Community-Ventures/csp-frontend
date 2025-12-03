import { CardList } from '@/components/card-list'
import { WhiteCard } from '@/components/white-card'
import { Button } from '@/components/ui/button'
import { Text } from '@/translations/wrapper'
import { translations } from '@/translations/text'
import { useFormatDate } from '@/lib/dates'
import { Link } from '@tanstack/react-router'
import { Settings } from 'lucide-react'
import type { ProviderPaymentHistoryItem } from '@/lib/api/paymentHistory'
import { useLanguageContext } from '@/translations/wrapper'
import { formatAmount } from '@/lib/currency'
import { PaymentItem } from '@/components/payment-item'

type PaymentAmountProps = {
  amountCents: number
}

function ProviderPaymentAmount({ amountCents }: PaymentAmountProps) {
  return (
    <span className="font-bold text-green-600">
      +{formatAmount(amountCents)}
    </span>
  )
}

export type ProviderPaymentsListProps = {
  payments: ProviderPaymentHistoryItem[]
  isPayable: boolean
  isPaymentEnabled: boolean
}

export function ProviderPaymentsList({
  payments,
  isPayable,
  isPaymentEnabled,
}: ProviderPaymentsListProps) {
  const formatDate = useFormatDate()
  const { lang } = useLanguageContext()

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
      items={payments.map((payment) => {
        const hasCaredays =
          payment.payment_type === 'care_days' &&
          payment.care_days &&
          payment.care_days.length > 0
        const hasPartialPayments = payment.care_days?.some(
          (day) => day.amount_missing_cents && day.amount_missing_cents > 0
        )
        const isLumpSum = payment.payment_type === 'lump_sum'
        const isExpandable = hasCaredays || isLumpSum // Both care days and lump sum expandable

        return (
          <ProviderPaymentItem
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

function ProviderPaymentItem({
  payment,
  hasCaredays,
  hasPartialPayments,
  isLumpSum,
  isExpandable,
  formatDate,
  lang,
}: {
  payment: ProviderPaymentHistoryItem
  hasCaredays: boolean
  hasPartialPayments: boolean
  isLumpSum: boolean
  isExpandable: boolean
  formatDate: (date: Date) => string
  lang: string
}) {
  return (
    <PaymentItem
      title={payment.child_name}
      amountCents={payment.amount_cents}
      createdAt={payment.created_at}
      careDays={payment.care_days}
      lumpSum={payment.lump_sum}
      allocationMonth={undefined} // Providers don't see allocation month
      hasCaredays={hasCaredays}
      hasPartialPayments={hasPartialPayments}
      isLumpSum={isLumpSum}
      isExpandable={isExpandable}
      formatDate={formatDate}
      lang={lang}
      renderAmount={(amountCents) => (
        <ProviderPaymentAmount amountCents={amountCents} />
      )}
      amountClassName="text-green-600 font-medium"
    />
  )
}
