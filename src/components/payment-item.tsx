import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { formatAmount } from '@/lib/currency'
import { Text, useLanguageContext } from '@/translations/wrapper'
import { translations } from '@/translations/text'
import { useFormatDate } from '@/lib/dates'
import type {
  PaymentCareDayDetail,
  PaymentLumpSumDetail,
} from '@/lib/api/paymentHistory'

interface PaymentItemProps {
  title: string
  amountCents: number
  createdAt: string
  careDays: PaymentCareDayDetail[]
  lumpSum?: PaymentLumpSumDetail | null
  allocationMonth?: string
  renderAmount: (amountCents: number) => React.ReactNode
  amountClassName?: string
}

export function PaymentItem({
  title,
  amountCents,
  createdAt,
  careDays,
  lumpSum,
  allocationMonth,
  renderAmount,
  amountClassName = 'text-gray-700',
}: PaymentItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { lang } = useLanguageContext()
  const formatDate = useFormatDate()

  // Derive values from props
  const hasCaredays = careDays.length > 0
  const hasPartialPayments = careDays.some(
    (day) => day.amount_missing_cents && day.amount_missing_cents > 0
  )
  const isLumpSum = lumpSum !== null && lumpSum !== undefined
  const isExpandable = hasCaredays || isLumpSum

  return (
    <div className="space-y-2">
      <div
        className={`flex justify-between items-start gap-4 ${
          isExpandable ? 'cursor-pointer' : ''
        }`}
        onClick={() => isExpandable && setIsExpanded(!isExpanded)}
        onKeyDown={(e) => {
          if (isExpandable && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            setIsExpanded(!isExpanded)
          }
        }}
        tabIndex={isExpandable ? 0 : undefined}
        role={isExpandable ? 'button' : undefined}
        aria-expanded={isExpandable ? isExpanded : undefined}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <strong className="text-lg truncate">{title}</strong>
            {hasPartialPayments && (
              <span className="text-yellow-600 text-xs">⚠</span>
            )}
          </div>
          <div className="text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              {formatDate(new Date(createdAt))}
              {hasCaredays && (
                <>
                  <span>•</span>
                  <span>
                    {careDays.length}{' '}
                    {careDays.length === 1 ? (
                      <Text text={translations.general.paymentHistory.day} />
                    ) : (
                      <Text text={translations.general.paymentHistory.days} />
                    )}
                  </span>
                </>
              )}
              {isLumpSum && (
                <>
                  <span>•</span>
                  <span>
                    <Text text={translations.general.paymentHistory.lumpSum} />
                  </span>
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
        <div className="text-right">{renderAmount(amountCents)}</div>
      </div>

      {isLumpSum && lumpSum && (
        <div
          className={`transition-all duration-300 ${
            isExpanded
              ? 'max-h-[1000px] opacity-100'
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="pl-4 border-l-2 border-gray-200 pt-2 text-sm text-gray-600 space-y-1">
            {allocationMonth && (
              <div>
                <Text
                  text={translations.general.paymentHistory.fromAllocationMonth}
                />
                :{' '}
                {new Date(allocationMonth).toLocaleDateString(lang, {
                  year: 'numeric',
                  month: 'long',
                  timeZone: 'UTC',
                })}
              </div>
            )}
            {lumpSum.days > 0 && (
              <div>
                <Text text={translations.general.paymentHistory.fullDays} />:{' '}
                {lumpSum.days}
              </div>
            )}
            {lumpSum.half_days > 0 && (
              <div>
                <Text text={translations.general.paymentHistory.halfDays} />:{' '}
                {lumpSum.half_days}
              </div>
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
            {careDays.map((day) => (
              <div
                key={day.date + '-' + day.type}
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
                    <span className="text-yellow-600 text-xs">
                      ⚠{' '}
                      <Text
                        text={translations.general.paymentHistory.partial}
                      />
                    </span>
                  ) : null}
                </div>
                <span className={amountClassName}>
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
