import { useFamilyContext } from '@/routes/family/wrapper'
import type { Provider } from '@/routes/family/wrapper'
import { Button } from '@/components/ui/button'
import { LoadingPage } from '@/components/pages/loading-page'
import { translations } from '@/translations/text'
import { Text, useText, useLanguageContext } from '@/translations/wrapper'
import { usePaymentData } from '../use-payment-data'
import { formatAmount, dollarToCents } from '@/lib/currency'
import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { z } from 'zod'
import { useValidateForm, useZodSchema } from '@/lib/schemas'
import { FormErrorMessage } from '@/components/form-error'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { lumpPaymentConfirmationRoute } from '@/routes/family/routes'
import { useMutation } from '@tanstack/react-query'
import { createLumpSum } from '@/lib/api/lumpSums'
import { toast } from 'sonner'
import { paymentRoute } from '@/routes/family/routes'
import { formatMonthForDisplay, parseAndValidateDate } from '@/lib/date-utils'
import { findChildById } from '@/lib/children'

import { monthAllocationSchema } from '@/lib/schemas'

export type GetMonthAllocation = z.infer<typeof monthAllocationSchema>

export function LumpPaymentPage({ provider }: { provider: Provider }) {
  const t = translations.family.lumpPaymentPage
  const { children, selectedChildInfo } = useFamilyContext()
  const { lang } = useLanguageContext()
  const text = useText()
  const {
    setDate,
    allocationQuery,
    paymentRateQuery,
    prevMonthAllocation,
    nextMonthAllocation,
  } = usePaymentData()
  const navigate = useNavigate()
  const context = paymentRoute.useRouteContext()

  // Validation for integer day fields (0-31)
  const validateDays = (val: string) => {
    const num = parseInt(val, 10)
    return !isNaN(num) && num >= 0 && num <= 31
  }

  const lumpSumSchema = useZodSchema(
    z.object({
      amount: z.string().refine((val) => parseFloat(val) > 0, {
        message: text(t.amountRequired),
      }),
      days: z.string().refine((val) => val === '' || validateDays(val), {
        message: text(t.daysRequired),
      }),
      halfDays: z.string().refine((val) => val === '' || validateDays(val), {
        message: text(t.halfDaysRequired),
      }),
    })
  )
  type LumpSumForm = z.infer<typeof lumpSumSchema>

  const [formData, setFormData] = useState<LumpSumForm>({
    amount: '',
    halfDays: '0',
    days: '0',
  })

  const { getError, submit } = useValidateForm(lumpSumSchema, formData)

  const selectedAllocation = useMemo(() => {
    if (!allocationQuery.data) {
      return null
    }
    return allocationQuery.data
  }, [allocationQuery.data])

  const handleAmountChange = (value: string) => {
    const sanitizedValue = value.replace(/[^0-9.]/g, '')
    const parts = sanitizedValue.split('.')
    if (parts.length > 2) {
      return
    }
    if (parts[1] && parts[1].length > 2) {
      setFormData((prev) => ({
        ...prev,
        amount: parts[0] + '.' + parts[1].substring(0, 2),
      }))
    } else {
      setFormData((prev) => ({ ...prev, amount: sanitizedValue }))
    }
  }

  const handleAmountBlur = (value: string) => {
    if (value) {
      const floatValue = parseFloat(value)
      if (!isNaN(floatValue)) {
        setFormData((prev) => ({
          ...prev,
          amount: floatValue.toFixed(2),
        }))
      } else {
        setFormData((prev) => ({ ...prev, amount: '' }))
      }
    }
  }

  const handleIntegerInputChange = (
    field: 'days' | 'halfDays',
    value: string
  ) => {
    // Allow empty string while typing
    if (value === '') {
      setFormData((prev) => ({ ...prev, [field]: '' }))
      return
    }

    // Only update if value passes validation
    if (validateDays(value)) {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleIntegerInputBlur = (field: 'days' | 'halfDays') => {
    // On blur, if empty, set to '0'
    if (formData[field] === '') {
      setFormData((prev) => ({ ...prev, [field]: '0' }))
    }
  }

  const child = findChildById(children, selectedChildInfo.id)

  const lumpSumMutation = useMutation({
    mutationFn: (data: {
      allocation_id: number
      provider_id: string
      amount_cents: number
      days: number
      half_days: number
    }) => createLumpSum(context, data),
    onSuccess: () => {
      toast.success(text(t.lumpPaymentSuccess))
      navigate({
        to: lumpPaymentConfirmationRoute.to,
        search: {
          providerName: provider?.name || '',
          childName: child?.firstName || '',
          month: selectedAllocation?.date || '',
          days: formData.days,
          halfDays: formData.halfDays,
          amount: formData.amount,
          providerId: provider.id,
        },
      })
    },
    onError: (error) => {
      console.error('Lump sum payment error:', error)
      if (
        error instanceof Error &&
        error.message === 'MONTHLY_ALLOCATION_EXCEEDED'
      ) {
        toast.error(text(t.monthlyAllocationExceededError))
      } else {
        toast.error(text(t.lumpPaymentError))
      }
    },
  })

  const handleSubmit = () => {
    submit(() => {
      if (selectedAllocation) {
        lumpSumMutation.mutate({
          allocation_id: selectedAllocation.id,
          provider_id: provider.id,
          amount_cents: dollarToCents(formData.amount),
          days: parseInt(formData.days || '0', 10),
          half_days: parseInt(formData.halfDays || '0', 10),
        })
      } else {
        toast.error(text(t.lumpPaymentError))
      }
    })
  }

  const goToPrevMonth = () => {
    if (!prevMonthAllocation) return
    const newDate = parseAndValidateDate(prevMonthAllocation.date)
    if (newDate) {
      setDate(newDate)
    }
  }

  const goToNextMonth = () => {
    if (!nextMonthAllocation) return
    const newDate = parseAndValidateDate(nextMonthAllocation.date)
    if (newDate) {
      setDate(newDate)
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

  return (
    <div className="flex flex-col items-center gap-8 p-4 min-w-[320px] pb-8">
      <div className="text-center w-full max-w-md md:max-w-2xl">
        <Text text={t.paymentDescription} />
      </div>

      <div className="w-full max-w-md md:max-w-2xl">
        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={goToPrevMonth}
            disabled={!prevMonthAllocation}
            variant="ghost"
            size="icon"
          >
            <ChevronLeft />
          </Button>
          <div className="text-lg font-semibold">
            {selectedAllocation &&
              formatMonthForDisplay(selectedAllocation.date, lang)}
          </div>
          <Button
            onClick={goToNextMonth}
            disabled={!nextMonthAllocation}
            variant="ghost"
            size="icon"
          >
            <ChevronRight />
          </Button>
        </div>

        <div className="bg-tertiary-background rounded-3xl w-full max-w-md md:max-w-2xl p-5">
          <div className="text-sm text-center pb-2">
            <Text text={t.monthBalance} />
          </div>
          <div className="text-3xl text-center">
            {formatAmount(selectedAllocation?.remaining_unpaid_cents || 0)}
          </div>
        </div>
      </div>

      <div className="w-full max-w-md md:max-w-2xl space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">
            <Text text={t.amountLabel} />
          </Label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <Input
              id="amount"
              type="text"
              inputMode="decimal"
              className="pl-7"
              value={formData.amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              onBlur={(e) => handleAmountBlur(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <FormErrorMessage error={getError('amount')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="days">
            <Text text={t.daysLabel} />
          </Label>
          <Input
            id="days"
            type="number"
            min="0"
            max="31"
            step="1"
            value={formData.days}
            onChange={(e) => handleIntegerInputChange('days', e.target.value)}
            onBlur={() => handleIntegerInputBlur('days')}
            placeholder="0"
          />
          <FormErrorMessage error={getError('days')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="halfDays">
            <Text text={t.halfDaysLabel} />
          </Label>
          <Input
            id="halfDays"
            type="number"
            min="0"
            max="31"
            step="1"
            value={formData.halfDays}
            onChange={(e) =>
              handleIntegerInputChange('halfDays', e.target.value)
            }
            onBlur={() => handleIntegerInputBlur('halfDays')}
            placeholder="0"
          />
          <FormErrorMessage error={getError('halfDays')} />
        </div>
      </div>

      <div className="w-full flex justify-center">
        <Button
          type="button"
          onClick={handleSubmit}
          loading={lumpSumMutation.isPending}
          className="w-full max-w-md md:max-w-2xl py-3 text-lg"
        >
          <Text text={t.submitButton} />
        </Button>
      </div>
    </div>
  )
}
