import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMonthAllocation, submitCareDays } from '@/lib/api/children'
import { createCareDay, deleteCareDay, updateCareDay } from '@/lib/api/careDays'
import { getPaymentRate, createPaymentRate } from '@/lib/api/paymentRates'
import { useFamilyContext } from '../../wrapper'
import { paymentRoute } from '../../routes'
import React, { useEffect } from 'react'
import { toast } from 'sonner'
import { useText } from '@/translations/wrapper'
import { translations } from '@/translations/text'

interface CustomError extends Error {
  response?: Response
}

export function usePaymentData() {
  const t = translations.family.paymentPage
  const text = useText()
  const { providerId } = paymentRoute.useParams()
  const { selectedChildInfo } = useFamilyContext()
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

  const allocationQuery = useQuery({
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
        date.getMonth() + 1,
        date.getFullYear(),
        providerId
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
        prevMonth.getMonth() + 1,
        prevMonth.getFullYear(),
        providerId
      )
    },
    enabled:
      !!selectedChildInfo.id &&
      !!providerId &&
      !!context &&
      !prevMonthAllocationFailed,
    retry: (failureCount, error: CustomError) => {
      if (error.response && error.response.status === 400) {
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
        nextMonth.getMonth() + 1,
        nextMonth.getFullYear(),
        providerId
      )
    },
    enabled:
      !!selectedChildInfo.id &&
      !!providerId &&
      !!context &&
      !nextMonthAllocationFailed,
    retry: (failureCount, error: CustomError) => {
      if (error.response && error.response.status === 400) {
        setNextMonthAllocationFailed(true)
        return false
      }
      return failureCount < 3
    },
  })

  const paymentRateQuery = useQuery({
    queryKey: ['paymentRate', providerId, selectedChildInfo.id],
    queryFn: () => getPaymentRate(context, providerId, selectedChildInfo.id),
    enabled: !!providerId && !!selectedChildInfo.id && !!context,
    retry: (failureCount) => {
      return failureCount < 3
    },
  })

  const createCareDayMutation = useMutation({
    mutationFn: (variables: {
      type: 'Full Day' | 'Half Day'
      date: string
    }) => {
      if (!allocationQuery.data)
        return Promise.reject(new Error('Allocation not loaded'))
      return createCareDay(
        context,
        allocationQuery.data.id,
        providerId,
        variables.date,
        variables.type
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allocation'] })
    },
  })

  const updateCareDayMutation = useMutation({
    mutationFn: (variables: {
      careDayId: number
      type: 'Full Day' | 'Half Day'
    }) => updateCareDay(context, variables.careDayId, variables.type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allocation'] })
    },
  })

  const deleteCareDayMutation = useMutation({
    mutationFn: (careDayId: number) => deleteCareDay(context, careDayId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allocation'] })
    },
  })

  const submitCareDaysMutation = useMutation({
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

  const createPaymentRateMutation = useMutation({
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

  return {
    date,
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
  }
}
