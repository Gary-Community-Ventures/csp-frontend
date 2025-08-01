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
import React, { useState, useEffect } from 'react'
import { z } from 'zod'
import { paymentRoute } from '../routes'
import { useFamilyContext } from '../wrapper'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

import { Header } from '@/components/header'
import { translations } from '@/translations/text'
import { Text } from '@/translations/wrapper'

export function PaymentPage() {
  const t = translations.family.home
  const { providerId } = paymentRoute.useParams()
  const { selectedChildInfo, providers, children } = useFamilyContext()
  const { context } = paymentRoute.useRouteContext()
  const [date, setDate] = React.useState(new Date());
  const [prevMonthAllocationFailed, setPrevMonthAllocationFailed] = React.useState(false);
  const [nextMonthAllocationFailed, setNextMonthAllocationFailed] = React.useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    setPrevMonthAllocationFailed(false);
    setNextMonthAllocationFailed(false);
  }, [date]);
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
    enabled: !!selectedChildInfo.id && !!providerId && !!context,
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
    enabled: !!selectedChildInfo.id && !!providerId && !!context,
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

  const { mutate: submitCareDaysMutation } = useMutation({
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
      toast.success('Payment rate set successfully!')
    },
    onError: (error) => {
      toast.error(`Failed to set payment rate: ${error.message}`)
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
      toast.error('Please enter valid positive numbers for both rates.')
      return
    }
    createPaymentRateMutation({
      halfDayRateCents: half,
      fullDayRateCents: full,
    })
  }

  if (isLoadingAllocation || isLoadingPaymentRate || !context) {
    return <div>Loading...</div>
  }

  if (isErrorPaymentRate || !paymentRate) {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle>Set Payment Rates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Before you can manage care days, please set the payment rates for
            this child and provider.
          </p>
          <div className="space-y-2">
            <Label htmlFor="halfDayRate">Half Day Rate (USD)</Label>
            <Input
              id="halfDayRate"
              type="number"
              value={halfDayRate}
              onChange={(e) => setHalfDayRate(e.target.value)}
              placeholder="e.g., 25.00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullDayRate">Full Day Rate (USD)</Label>
            <Input
              id="fullDayRate"
              type="number"
              value={fullDayRate}
              onChange={(e) => setFullDayRate(e.target.value)}
              placeholder="e.g., 50.00"
            />
          </div>
          <Button onClick={handleSetPaymentRate} className="w-full">
            Set Rates
          </Button>
        </CardContent>
      </Card>
    )
  }

  const provider = providers.find((p) => p.id === providerId)
  const child = children.find((c) => c.id === selectedChildInfo.id)

  return (
    <div className="flex flex-col items-center gap-8 p-4">
      <div className="text-center">
        <Header>
            Payment for {provider?.name}
        </Header>
        <p className="text-muted-foreground max-w-prose">
          Add your planned care days for {provider?.name} for {child?.firstName}. Hit
          submit when you want to send these days to your {provider?.name}. You can
          always modify days up until the Monday of the week care is taking place. At that point
          the week is locked and a Transaction will be created to pay the provider for that week.
        </p>
      </div>
      <div className="w-full max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex flex-col items-center">
              <span className="text-sm font-medium">Total Allocation:</span>
              <span className="text-lg font-bold">
                {formatAmount(allocation?.allocation_cents || 0)}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm font-medium">Used Allocation:</span>
              <span className="text-lg font-bold">
                {formatAmount(allocation?.used_cents || 0)}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm font-medium">Remaining Allocation:</span>
              <span className="text-lg font-bold">
                {formatAmount(allocation?.remaining_cents || 0)}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm font-medium">Half Day Rate:</span>
              <span className="text-lg font-bold">
                {formatAmount(paymentRate?.half_day_rate_cents || 0)}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm font-medium">Full Day Rate:</span>
              <span className="text-lg font-bold">
                {formatAmount(paymentRate?.full_day_rate_cents || 0)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="w-full flex justify-center">
        {allocation && (
          <Calendar
            allocation={allocation}
            onDateChange={setDate}
            onSubmit={submitCareDaysMutation}
            onDayTypeChange={handleDayTypeChange}
            prevMonthAllocationFailed={prevMonthAllocationFailed}
            nextMonthAllocationFailed={nextMonthAllocationFailed}
          />
        )}
      </div>
    </div>
  )
}
