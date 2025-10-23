import { CardList } from '@/components/card-list'
import { WhiteCard } from '@/components/white-card'
import { Text } from '@/translations/wrapper'
import { translations } from '@/translations/text'
import { useFormatDate } from '@/lib/dates'
import type { FamilyPaymentHistoryItem } from '@/lib/api/paymentHistory'
import { useLanguageContext } from '@/translations/wrapper'

import { formatAmount } from '@/lib/currency'

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
                :{' '}
                {new Date(payment.month).toLocaleDateString(lang, {
                  year: 'numeric',
                  month: 'short',
                  timeZone: 'UTC',
                })}
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
