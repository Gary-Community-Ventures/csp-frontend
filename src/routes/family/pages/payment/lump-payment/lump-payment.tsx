import { useFamilyContext } from '../../../wrapper'
import { Button } from '@/components/ui/button'
import { LoadingPage } from '@/components/pages/loading-page'
import { translations } from '@/translations/text'
import { Text, useText, useLanguageContext } from '@/translations/wrapper'
import { usePaymentData } from '../use-payment-data'
import { formatAmount, dollarToCents } from '@/lib/currency'
import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { z } from 'zod'
import { useValidateForm } from '@/lib/schemas'
import { FormErrorMessage } from '@/components/form-error'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { lumpPaymentConfirmationRoute } from '../../../routes'
import { useMutation } from '@tanstack/react-query'
import { createLumpSum } from '@/lib/api/lumpSums'
import { toast } from 'sonner'
import { paymentRoute } from '../../../routes'
import { Spinner } from '@/components/ui/spinner'

import { monthAllocationSchema } from '@/lib/schemas'

export type GetMonthAllocation = z.infer<typeof monthAllocationSchema>

const lumpSumSchema = z.object({
  amount: z.string().refine((val) => parseFloat(val) > 0, {
    message: 'Amount must be a positive number',
  }),
  hours: z.string().refine((val) => parseFloat(val) > 0, {
    message: 'Hours must be a positive number',
  }),
})

type LumpSumForm = z.infer<typeof lumpSumSchema>

export function LumpPaymentPage({ providerId }: { providerId: string }) {
  const t = translations.family.lumpPaymentPage
  const { providers, children, selectedChildInfo } = useFamilyContext()
  const { lang } = useLanguageContext()
  const text = useText()
  const {
    allocationQuery,
    paymentRateQuery,
    prevMonthAllocation,
    nextMonthAllocation,
  } = usePaymentData()
  const navigate = useNavigate()
  const { context } = paymentRoute.useRouteContext() // Get context

  const [formData, setFormData] = React.useState<LumpSumForm>({
    amount: '',
    hours: '',
  })

  const [selectedAllocation, setSelectedAllocation] =
    React.useState<GetMonthAllocation | null>(null)

  const { getError, submit } = useValidateForm(lumpSumSchema, formData)

  const currentAllocation = allocationQuery.data

  React.useEffect(() => {
    if (currentAllocation) {
      setSelectedAllocation(currentAllocation)
    }
  }, [currentAllocation])

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

  const handleHoursChange = (value: string) => {
    const sanitizedValue = value.replace(/[^0-9.]/g, '')
    setFormData((prev) => ({ ...prev, hours: sanitizedValue }))
  }

  const provider = providers.find((p) => p.id === providerId)
  const child = children.find((c) => c.id === selectedChildInfo.id)

  const lumpSumMutation = useMutation({
    mutationFn: (data: {
      allocation_id: number
      provider_id: string
      amount_cents: number
    }) => createLumpSum(context, data),
    onSuccess: () => {
      toast.success(text(t.lumpPaymentSuccess))
      navigate({
        to: lumpPaymentConfirmationRoute.to,
        search: {
          providerName: provider?.name || '',
          childName: child?.firstName || '',
          month: selectedAllocation?.date || '',
          hours: formData.hours,
          amount: formData.amount,
          providerId: providerId,
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
        toast.error(`Failed to submit lump sum payment`)
      }
    },
  })

  const handleSubmit = () => {
    submit(() => {
      if (selectedAllocation) {
        lumpSumMutation.mutate({
          allocation_id: selectedAllocation.id,
          provider_id: providerId,
          amount_cents: dollarToCents(formData.amount),
        })
      } else {
        toast.error('No allocation selected.')
      }
    })
  }

  const goToPrevMonth = () => {
    if (!prevMonthAllocation) return
    setSelectedAllocation(prevMonthAllocation)
  }

  const goToNextMonth = () => {
    if (!nextMonthAllocation) return
    setSelectedAllocation(nextMonthAllocation)
  }

  if (allocationQuery.isLoading || paymentRateQuery.isLoading) {
    return <LoadingPage />
  }

  return (
    <div className="flex flex-col items-center gap-8 p-4 min-w-[320px] pb-8">
      <div className="text-center w-full max-w-md md:max-w-2xl">
        <Text
          text={t.paymentDescription}
          data={{
            providerName: provider?.name,
            childFirstName: child?.firstName,
          }}
        />
      </div>

      <div className="bg-tertiary-background rounded-3xl w-full max-w-md md:max-w-2xl p-5">
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
              new Date(selectedAllocation.date).toLocaleString(lang, {
                month: 'long',
                year: 'numeric',
                timeZone: 'UTC',
              })}
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
        <div className="text-sm text-center pb-2">
          <Text text={t.monthBalance} />
        </div>
        <div className="text-3xl text-center">
          {formatAmount(selectedAllocation?.remaining_cents || 0)}
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
          <Label htmlFor="hours">
            <Text text={t.hoursLabel} />
          </Label>
          <Input
            id="hours"
            type="text"
            inputMode="decimal"
            value={formData.hours}
            onChange={(e) => handleHoursChange(e.target.value)}
            placeholder="0.0"
          />
          <FormErrorMessage error={getError('hours')} />
        </div>
      </div>

      <div className="w-full flex justify-center">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={lumpSumMutation.isPending} // Disable button while pending
          className="w-full max-w-md md:max-w-2xl py-3 text-lg"
        >
          {lumpSumMutation.isPending ? (
            <div className="flex items-center justify-center gap-2">
              <Spinner />{' '}
              <Text text={translations.general.loadingPage.loading} />
            </div>
          ) : (
            <Text text={t.submitButton} />
          )}
        </Button>
      </div>
    </div>
  )
}
