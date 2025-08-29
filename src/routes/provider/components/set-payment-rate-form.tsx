import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { translations } from '@/translations/text'
import { Text, useText } from '@/translations/wrapper'
import { useState } from 'react'
import { dollarToCents } from '@/lib/currency'
import { useValidateForm, useZodSchema } from '@/lib/schemas'
import { z } from 'zod'
import { FormErrorMessage } from '@/components/form-error'
import type { Child } from '../wrapper'
import { useNavigate, useRouter } from '@tanstack/react-router'

type SetPaymentRateFormProps = {
  createPaymentRate: (
    halfDayRateCents: number,
    fullDayRateCents: number
  ) => Promise<void>
  child: Child
}

const MAX_RATE = 160
const MIN_RATE = 1

export function SetPaymentRateForm({
  createPaymentRate,
  child,
}: SetPaymentRateFormProps) {
  const t = translations.provider.setRate
  const text = useText()
  const navigate = useNavigate()
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  const errorMessage = `${text(t.rateError.part1)}${MIN_RATE}${text(t.rateError.part2)}${MAX_RATE}`

  const paymentRateFormSchema = useZodSchema(
    z.object({
      halfDayRate: z
        .number({
          coerce: true,
          errorMap: () => {
            return { message: errorMessage }
          },
        })
        .min(MIN_RATE)
        .max(MAX_RATE),
      fullDayRate: z
        .number({
          coerce: true,
          errorMap: () => {
            return { message: errorMessage }
          },
        })
        .min(MIN_RATE)
        .max(MAX_RATE),
    })
  )

  type PaymentRateForm = z.infer<typeof paymentRateFormSchema>

  const [formData, setFormData] = useState<{
    halfDayRate: string
    fullDayRate: string
  }>({
    halfDayRate: '',
    fullDayRate: '',
  })

  const { getError, submit } = useValidateForm(paymentRateFormSchema, formData)

  const handleSetPaymentRate = () => {
    submit((data) => {
      setSubmitting(true)

      createPaymentRate(
        dollarToCents(data.halfDayRate),
        dollarToCents(data.fullDayRate)
      )
        .then(() => {
          router.invalidate()
          navigate({ to: '/provider/home' })
        })
        .finally(() => {
          setSubmitting(false)
        })
    })
  }

  const handleRateChange = (field: keyof PaymentRateForm, value: string) => {
    const sanitizedValue = value.replace(/[^0-9.]/g, '')
    const parts = sanitizedValue.split('.')
    if (parts.length > 2) {
      return
    }
    if (parts[1] && parts[1].length > 2) {
      setFormData((prev) => ({
        ...prev,
        [field]: parts[0] + '.' + parts[1].substring(0, 2),
      }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: sanitizedValue }))
    }
  }

  const handleBlur = (field: keyof PaymentRateForm, value: string) => {
    if (value) {
      const floatValue = parseFloat(value)
      if (!isNaN(floatValue)) {
        setFormData((prev) => ({
          ...prev,
          [field]: floatValue.toFixed(2),
        }))
      } else {
        setFormData((prev) => ({ ...prev, [field]: '' }))
      }
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardContent>
        <div className="text-center font-bold text-lg mb-2 text-secondary">
          <Text text={t.setPaymentRates} />
          {child.firstName} {child.lastName}
        </div>
        <div className="text-center mb-6">
          <Text text={t.setPaymentRatesDescription} />
          {child.firstName} {child.lastName}
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="halfDayRate">
              <Text text={t.halfDayRate} />
            </Label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <Input
                id="halfDayRate"
                type="text"
                inputMode="decimal"
                className="pl-7"
                value={formData.halfDayRate}
                onChange={(e) =>
                  handleRateChange('halfDayRate', e.target.value)
                }
                onBlur={(e) => handleBlur('halfDayRate', e.target.value)}
                placeholder="0.00"
              />
            </div>
            <FormErrorMessage error={getError('halfDayRate')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullDayRate">
              <Text text={t.fullDayRate} />
            </Label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <Input
                id="fullDayRate"
                type="text"
                inputMode="decimal"
                className="pl-7"
                value={formData.fullDayRate}
                onChange={(e) =>
                  handleRateChange('fullDayRate', e.target.value)
                }
                onBlur={(e) => handleBlur('fullDayRate', e.target.value)}
                placeholder="0.00"
              />
            </div>
            <FormErrorMessage error={getError('fullDayRate')} />
          </div>
        </div>
        <Button
          onClick={handleSetPaymentRate}
          className="w-full mt-4"
          loading={submitting}
        >
          <Text text={t.setRatesButton} />
        </Button>
      </CardContent>
    </Card>
  )
}
