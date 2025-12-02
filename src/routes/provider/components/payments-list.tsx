import { useState } from 'react'
import { CardList } from '@/components/card-list'
import { WhiteCard } from '@/components/white-card'
import { Button } from '@/components/ui/button'
import { Text } from '@/translations/wrapper'
import { translations } from '@/translations/text'
import { useFormatDate } from '@/lib/dates'
import { Link } from '@tanstack/react-router'
import { Settings, ChevronDown, ChevronRight } from 'lucide-react'
import type { ProviderPaymentHistoryItem } from '@/lib/api/paymentHistory'
import { useLanguageContext } from '@/translations/wrapper'

import { formatAmount } from '@/lib/currency'

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
          <PaymentItem
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

function PaymentItem({
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
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="space-y-2">
      <div
        className={`flex justify-between items-start gap-4 ${
          isExpandable ? 'cursor-pointer' : ''
        }`}
        onClick={() => isExpandable && setIsExpanded(!isExpanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <strong className="text-lg truncate">{payment.child_name}</strong>
            {hasPartialPayments && (
              <span className="text-yellow-600 text-xs">⚠</span>
            )}
          </div>
          <div className="text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              {formatDate(new Date(payment.created_at))}
              {hasCaredays && (
                <>
                  <span>•</span>
                  <span>
                    {payment.care_days.length}{' '}
                    {payment.care_days.length === 1 ? 'day' : 'days'}
                  </span>
                </>
              )}
              {isLumpSum && (
                <>
                  <span>•</span>
                  <span>Lump sum</span>
                </>
              )}
              {isExpandable && (
                <>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="text-right">
          <ProviderPaymentAmount amountCents={payment.amount_cents} />
        </div>
      </div>

      {isLumpSum && payment.lump_sum && (
        <div
          className={`transition-all duration-300 ${
            isExpanded
              ? 'max-h-[1000px] opacity-100'
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="pl-4 border-l-2 border-gray-200 pt-2 text-sm text-gray-600 space-y-1">
            {payment.lump_sum.days > 0 && (
              <div>Full Days: {payment.lump_sum.days}</div>
            )}
            {payment.lump_sum.half_days > 0 && (
              <div>Half Days: {payment.lump_sum.half_days}</div>
            )}
          </div>
        </div>
      )}

      {hasCaredays && (
        <div
          className={`transition-all duration-300 ${
            isExpanded
              ? 'max-h-[1000px] opacity-100'
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="pl-4 border-l-2 border-gray-200 space-y-2 pt-2">
            {payment.care_days.map((day, index) => (
              <div
                key={index}
                className="flex justify-between items-center text-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">
                    {new Date(day.date).toLocaleDateString(lang, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      timeZone: 'UTC',
                    })}
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-600">{day.type}</span>
                  {day.amount_missing_cents && day.amount_missing_cents > 0 ? (
                    <span className="text-yellow-600 text-xs">⚠ Partial</span>
                  ) : null}
                </div>
                <span className="text-green-600 font-medium">
                  {formatAmount(day.amount_cents)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
