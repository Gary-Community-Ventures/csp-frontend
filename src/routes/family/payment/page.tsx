import { Calendar } from '@/components/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  createCareDay,
  deleteCareDay,
  getMonthAllocation,
  submitCareDays,
  updateCareDay,
  getPaymentRate,
  createPaymentRate,
} from '@/lib/requests'
import { allocatedCareDaySchema } from '@/lib/schemas'
import { formatAmount } from '@/lib/currency'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useBlocker } from '@tanstack/react-router'
import React, { useState, useEffect } from 'react'
import { z } from 'zod'
import { paymentRoute } from '../routes'
import { useFamilyContext } from '../wrapper'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'

import { Header } from '@/components/header'
import { translations } from '@/translations/text'
import { Text, useText } from '@/translations/wrapper'

export function PaymentPage() {
  const t = translations.family.paymentPage
  const text = useText()
  const { providerId } = paymentRoute.useParams()
  const { selectedChildInfo, providers, children } = useFamilyContext()
  const { context } = paymentRoute.useRouteContext()
  const [date, setDate] = React.useState(new Date())
  const [prevMonthAllocationFailed, setPrevMonthAllocationFailed] =
    React.useState(false)
  const [nextMonthAllocationFailed, setNextMonthAllocationFailed] =
    React.useState(false)
  const queryClient = useQueryClient()

  useEffect(() => {
    setPrevMonthAllocationFailed(false)
    setNextMonthAllocationFailed(false)
  }, [date])
  const [halfDayRate, setHalfDayRate] = React.useState('')
  const [fullDayRate, setFullDayRate] = React.useState('')

  const { data: allocation, isLoading: isLoadingAllocation } = useQuery({
    queryKey: [
      'allocation',
      selectedChildInfo.id,
      providerId,
      date.getMonth() + 1,
      date.getFullYear(),
    ],
    queryFn: () =>
      getMonthAllocation(
        context,
        selectedChildInfo.id,
        providerId,
        date.getMonth() + 1,
        date.getFullYear()
      ),
    enabled: !!selectedChildInfo.id && !!providerId && !!context,
  })

  useQuery({
    queryKey: [
      'allocation',
      selectedChildInfo.id,
      providerId,
      date.getMonth(),
      date.getFullYear(),
    ],
    queryFn: () => {
      const prevMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1)
      return getMonthAllocation(
        context,
        selectedChildInfo.id,
        providerId,
        prevMonth.getMonth() + 1,
        prevMonth.getFullYear()
      )
    },
    enabled: !!selectedChildInfo.id && !!providerId && !!context && !prevMonthAllocationFailed,
    retry: (failureCount, error: any) => {
      if (error.response?.status === 400) {
        setPrevMonthAllocationFailed(true)
        return false
      }
      return failureCount < 3
    },
  })

  useQuery({
    queryKey: [
      'allocation',
      selectedChildInfo.id,
      providerId,
      date.getMonth() + 2,
      date.getFullYear(),
    ],
    queryFn: () => {
      const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1)
      return getMonthAllocation(
        context,
        selectedChildInfo.id,
        providerId,
        nextMonth.getMonth() + 1,
        nextMonth.getFullYear()
      )
    },
    enabled: !!selectedChildInfo.id && !!providerId && !!context && !nextMonthAllocationFailed,
    retry: (failureCount, error: any) => {
      if (error.response?.status === 400) {
        setNextMonthAllocationFailed(true)
        return false
      }
      return failureCount < 3
    },
  })

  const {
    data: paymentRate,
    isLoading: isLoadingPaymentRate,
    isError: isErrorPaymentRate,
  } = useQuery({
    queryKey: ['paymentRate', providerId, selectedChildInfo.id],
    queryFn: () => getPaymentRate(context, providerId, selectedChildInfo.id),
    enabled: !!providerId && !!selectedChildInfo.id && !!context,
    retry: (failureCount) => {
      return failureCount < 3 // Retry other errors up to 3 times
    },
  })

  const { mutate: createCareDayMutation } = useMutation({
    mutationFn: (variables: {
      type: 'Full Day' | 'Half Day'
      date: string
    }) => {
      if (!allocation) return Promise.reject(new Error('Allocation not loaded'))
      return createCareDay(
        context,
        allocation.id,
        providerId,
        variables.date,
        variables.type
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allocation'] })
    },
  })

  const { mutate: updateCareDayMutation } = useMutation({
    mutationFn: (variables: {
      careDayId: number
      type: 'Full Day' | 'Half Day'
    }) => updateCareDay(context, variables.careDayId, variables.type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allocation'] })
    },
  })

  const { mutate: deleteCareDayMutation } = useMutation({
    mutationFn: (careDayId: number) => deleteCareDay(context, careDayId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allocation'] })
    },
  })

  const { mutate: submitCareDaysMutation, isPending: isSubmitting } = useMutation({
    mutationFn: () =>
      submitCareDays(
        context,
        selectedChildInfo.id,
        providerId,
        date.getMonth() + 1,
        date.getFullYear()
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allocation'] })
    },
  })

  const { mutate: createPaymentRateMutation } = useMutation({
    mutationFn: (variables: {
      halfDayRateCents: number
      fullDayRateCents: number
    }) =>
      createPaymentRate(
        context,
        providerId,
        selectedChildInfo.id,
        variables.halfDayRateCents,
        variables.fullDayRateCents
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentRate'] })
      toast.success(text(t.paymentRateSuccess))
    },
    onError: (error) => {
      toast.error(`${text(t.paymentRateError)} ${error.message}`)
    },
  })

  const handleDayTypeChange = (
    day: z.infer<typeof allocatedCareDaySchema> | null | undefined,
    type: 'Full Day' | 'Half Day' | 'none',
    selectedDate: Date
  ) => {
    if (type === 'none') {
      if (day) {
        deleteCareDayMutation(day.id)
      }
    } else if (day) {
      updateCareDayMutation({ careDayId: day.id, type })
    } else {
      createCareDayMutation({
        type,
        date: selectedDate.toISOString().split('T')[0],
      })
    }
  }

  const handleSetPaymentRate = () => {
    const half = parseFloat(halfDayRate) * 100
    const full = parseFloat(fullDayRate) * 100

    if (isNaN(half) || isNaN(full) || half <= 0 || full <= 0) {
      toast.error(text(t.invalidRatesError))
      return
    }
    createPaymentRateMutation({
      halfDayRateCents: half,
      fullDayRateCents: full,
    })
  }

  const hasPendingChanges = allocation?.care_days.some(
    (careDay) =>
      careDay.status === 'new' ||
      careDay.status === 'needs_resubmission' ||
      careDay.status === 'delete_not_submitted' 
  )

  useBlocker(
    () => hasPendingChanges,
    text(t.unsavedChangesBlocker)
  )

  if (isLoadingAllocation || isLoadingPaymentRate || !context) {
    return <Text text={t.loading} />
  }

  if (isErrorPaymentRate || !paymentRate) {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle><Text text={t.setPaymentRates} /></CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Text text={t.setPaymentRatesDescription} />
          <div className="space-y-2">
            <Label htmlFor="halfDayRate"><Text text={t.halfDayRate} /></Label>
            <Input
              id="halfDayRate"
              type="number"
              value={halfDayRate}
              onChange={(e) => setHalfDayRate(e.target.value)}
              placeholder="e.g., 25.00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullDayRate"><Text text={t.fullDayRate} /></Label>
            <Input
              id="fullDayRate"
              type="number"
              value={fullDayRate}
              onChange={(e) => setFullDayRate(e.target.value)}
              placeholder="e.g., 50.00"
            />
          </div>
          <Button onClick={handleSetPaymentRate} className="w-full">
            <Text text={t.setRatesButton} />
          </Button>
        </CardContent>
      </Card>
    )
  }

  const provider = providers.find((p) => p.id === providerId)
  const child = children.find((c) => c.id === selectedChildInfo.id)

  return (
    <div className="flex flex-col items-center gap-8 p-4 min-w-[320px] pb-8">
      <div className="text-center  w-full max-w-md md:max-w-2xl">
        <Header>
          <Text text={t.paymentFor} data={{ providerName: provider?.name }} />
        </Header>
        <Text
          text={t.paymentDescription}
          data={{
            providerName: provider?.name,
            childFirstName: child?.firstName,
          }}
        />
      </div>
      <div className="bg-tertiary-background rounded-3xl w-full max-w-md md:max-w-2xl p-5">
        <div className="text-sm text-center pb-2"><Text text={t.monthBalance} /></div>
        <div className="text-3xl text-center">
          {formatAmount(allocation?.remaining_cents || 0)}
        </div>
      </div>
      <div className="w-full flex justify-center">
        {allocation && (
          <Calendar
            allocation={allocation}
            onDateChange={setDate}
            onDayTypeChange={handleDayTypeChange}
            prevMonthAllocationFailed={prevMonthAllocationFailed}
            nextMonthAllocationFailed={nextMonthAllocationFailed}
            paymentRate={paymentRate}
          />
        )}
      </div>
      <div className="w-full flex justify-center">
        <Button
          type="button"
          onClick={() => submitCareDaysMutation()}
          disabled={!hasPendingChanges || isSubmitting}
          className="w-full max-w-md md:max-w-2xl py-3 text-lg"
        >
          {isSubmitting ? (
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
