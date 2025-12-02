import React from 'react'
import { useBlocker } from '@tanstack/react-router'
import { z } from 'zod'

import { useFamilyContext } from '@/routes/family/wrapper'
import type { Provider } from '@/routes/family/wrapper'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Checkbox } from '@/components/ui/checkbox'
import { translations } from '@/translations/text'
import { Text } from '@/translations/wrapper'
import { usePaymentData } from '../use-payment-data'
import { CareCalendar } from './care-calendar'
import { ConfirmUnsavedChangesDialog } from './confirm-unsaved-changes-dialog'
import { allocatedCareDaySchema } from '@/lib/schemas'
import { formatAmount } from '@/lib/currency'
import { LoadingPage } from '@/components/pages/loading-page'
import { findChildById } from '@/lib/children'

export function CalendarPaymentPage({ provider }: { provider: Provider }) {
  const t = translations.family.calendarPaymentPage
  const { children, selectedChildInfo } = useFamilyContext()
  const {
    setDate,
    allocationQuery,
    paymentRateQuery,
    createCareDayMutation,
    updateCareDayMutation,
    deleteCareDayMutation,
    submitCareDaysMutation,
    prevMonthAllocationFailed,
    nextMonthAllocationFailed,
  } = usePaymentData()

  const [partialPaymentAcknowledged, setPartialPaymentAcknowledged] =
    React.useState(false)
  const [showPartialPaymentError, setShowPartialPaymentError] =
    React.useState(false)

  const hasPendingChanges = allocationQuery.data?.care_days.some(
    (careDay) => careDay.status === 'needs_submission'
  )

  const hasPendingPartialPayments = allocationQuery.data?.care_days.some(
    (careDay) =>
      careDay.status === 'needs_submission' && careDay.is_partial_payment
  )

  // Reset checkbox when partial payments change or disappear
  React.useEffect(() => {
    if (!hasPendingPartialPayments) {
      setPartialPaymentAcknowledged(false)
      setShowPartialPaymentError(false)
    }
  }, [hasPendingPartialPayments])

  // Clear error when checkbox is checked
  React.useEffect(() => {
    if (partialPaymentAcknowledged) {
      setShowPartialPaymentError(false)
    }
  }, [partialPaymentAcknowledged])

  const blocker = useBlocker({
    shouldBlockFn: () => !!hasPendingChanges,
    withResolver: true,
  })

  const handleDayTypeChange = (
    day: z.infer<typeof allocatedCareDaySchema> | null | undefined,
    type: 'Full Day' | 'Half Day' | 'none',
    selectedDate: Date
  ) => {
    if (type === 'none') {
      if (day) {
        deleteCareDayMutation.mutate(day.id)
      }
    } else if (day) {
      updateCareDayMutation.mutate({ careDayId: day.id, type })
    } else {
      createCareDayMutation.mutate({
        type,
        date: selectedDate.toISOString().split('T')[0],
      })
    }
  }

  if (allocationQuery.isLoading || paymentRateQuery.isLoading) {
    return <LoadingPage />
  }

  if (allocationQuery.isError || !allocationQuery.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">
            <Text text={t.allocationNotFound} />
          </h2>
          <p className="text-gray-600">
            <Text text={t.allocationNotFoundDescription} />
          </p>
        </div>
      </div>
    )
  }
  const child = findChildById(children, selectedChildInfo.id)

  if (paymentRateQuery.isError || !paymentRateQuery.data) {
    return (
      <p className="text-center">
        <Text text={t.noPaymentRate.part1} />
        {child?.firstName} {child?.lastName}
        <Text text={t.noPaymentRate.part2} />
      </p>
    )
  }

  return (
    <div className="flex flex-col items-center gap-8 p-4 min-w-[320px] pb-8">
      <ConfirmUnsavedChangesDialog blocker={blocker} />
      <div className="text-center  w-full max-w-md md:max-w-2xl">
        <Text
          text={t.paymentDescription}
          data={{
            providerName: provider?.name,
            childFirstName: child?.firstName,
          }}
        />
      </div>
      <div className="bg-tertiary-background rounded-3xl w-full max-w-md md:max-w-2xl p-5">
        <div className="text-sm text-center pb-2">
          <Text text={t.monthBalance} />
        </div>
        <div className="text-3xl text-center">
          {formatAmount(allocationQuery.data?.remaining_unselected_cents || 0)}
        </div>
      </div>
      <CareCalendar
        allocation={allocationQuery.data}
        setDate={setDate}
        handleDayTypeChange={handleDayTypeChange}
        prevMonthAllocationFailed={prevMonthAllocationFailed}
        nextMonthAllocationFailed={nextMonthAllocationFailed}
        paymentRate={paymentRateQuery.data}
      />
      {hasPendingPartialPayments && (
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md md:max-w-2xl p-6">
          <label className="flex items-start gap-3 cursor-pointer group">
            <Checkbox
              checked={partialPaymentAcknowledged}
              onCheckedChange={(checked) =>
                setPartialPaymentAcknowledged(checked === true)
              }
              className="mt-0.5"
              aria-invalid={showPartialPaymentError}
            />
            <span className="text-sm text-gray-700 leading-relaxed select-none">
              <Text
                text={t.partialPaymentWarning}
                data={{
                  halfDayRate: formatAmount(
                    paymentRateQuery.data?.half_day_rate_cents || 0
                  ),
                  fullDayRate: formatAmount(
                    paymentRateQuery.data?.full_day_rate_cents || 0
                  ),
                }}
              />
            </span>
          </label>
          {showPartialPaymentError && (
            <div className="mt-3 text-sm text-red-600 flex items-start gap-2">
              <span className="text-red-600">⚠</span>
              <Text text={t.partialPaymentError} />
            </div>
          )}
        </div>
      )}
      <div className="w-full flex justify-center">
        <Button
          type="button"
          onClick={() => {
            if (hasPendingPartialPayments && !partialPaymentAcknowledged) {
              setShowPartialPaymentError(true)
              return
            }
            submitCareDaysMutation.mutate()
          }}
          disabled={!hasPendingChanges || submitCareDaysMutation.isPending}
          className="w-full max-w-md md:max-w-2xl py-3 text-lg"
        >
          {submitCareDaysMutation.isPending ? (
            <div className="flex items-center justify-center gap-2">
              <Spinner /> <Text text={t.submittingButton} />
            </div>
          ) : (
            <Text text={t.submitButton} />
          )}
        </Button>
      </div>
    </div>
  )
}
