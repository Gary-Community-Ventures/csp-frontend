import { useBlocker } from '@tanstack/react-router'
import { z } from 'zod'

import { useFamilyContext } from '../../../wrapper'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { translations } from '@/translations/text'
import { Text } from '@/translations/wrapper'
import { usePaymentData } from '../use-payment-data'
import { SetPaymentRateForm } from './set-payment-rate-form'
import { CareCalendar } from './care-calendar'
import { ConfirmUnsavedChangesDialog } from './confirm-unsaved-changes-dialog'
import { allocatedCareDaySchema } from '@/lib/schemas'
import { formatAmount } from '@/lib/currency'
import { LoadingPage } from '@/components/pages/loading-page'

export function CalendarPaymentPage({ providerId }: { providerId: string }) {
  const t = translations.family.calendarPaymentPage
  const { providers, children, selectedChildInfo } = useFamilyContext()
  const {
    setDate,
    allocationQuery,
    paymentRateQuery,
    createCareDayMutation,
    updateCareDayMutation,
    deleteCareDayMutation,
    submitCareDaysMutation,
    createPaymentRateMutation,
    prevMonthAllocationFailed,
    nextMonthAllocationFailed,
  } = usePaymentData()

  const hasPendingChanges = allocationQuery.data?.care_days.some(
    (careDay) =>
      careDay.status === 'new' ||
      careDay.status === 'needs_resubmission' ||
      careDay.status === 'delete_not_submitted'
  )

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

  if (paymentRateQuery.isError || !paymentRateQuery.data) {
    return (
      <SetPaymentRateForm
        createPaymentRateMutation={createPaymentRateMutation}
      />
    )
  }

  const provider = providers.find((p) => p.id === providerId)
  const child = children.find((c) => c.id === selectedChildInfo.id)

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
          {formatAmount(allocationQuery.data?.remaining_cents || 0)}
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
      <div className="w-full flex justify-center">
        <Button
          type="button"
          onClick={() => submitCareDaysMutation.mutate()}
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
