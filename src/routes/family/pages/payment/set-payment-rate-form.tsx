import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { translations } from '@/translations/text'
import { Text, useText } from '@/translations/wrapper'
import React from 'react'
import { toast } from 'sonner'
import { dollarToCents } from '@/lib/currency'

interface SetPaymentRateFormProps {
  createPaymentRateMutation: {
    mutate: (variables: {
      halfDayRateCents: number
      fullDayRateCents: number
    }) => void
  }
}

export function SetPaymentRateForm({
  createPaymentRateMutation,
}: SetPaymentRateFormProps) {
  const t = translations.family.paymentPage
  const text = useText()
  const [halfDayRate, setHalfDayRate] = React.useState('')
  const [fullDayRate, setFullDayRate] = React.useState('')

  const handleRateChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: string,
  ) => {
    const sanitizedValue = value.replace(/[^0-9.]/g, '')
    const parts = sanitizedValue.split('.')
    if (parts.length > 2) {
      // Only one dot allowed, so we prevent further input by not setting state
      return
    }
    if (parts[1] && parts[1].length > 2) {
      setter(parts[0] + '.' + parts[1].substring(0, 2))
    } else {
      setter(sanitizedValue)
    }
  }

  const handleBlur = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: string,
  ) => {
    if (value) {
      const floatValue = parseFloat(value)
      if (!isNaN(floatValue)) {
        setter(floatValue.toFixed(2))
      } else {
        setter('')
      }
    }
  }

  const handleSetPaymentRate = () => {
    const half = dollarToCents(halfDayRate)
    const full = dollarToCents(fullDayRate)

    if (isNaN(half) || isNaN(full) || half <= 0 || full <= 0) {
      toast.error(text(t.invalidRatesError))
      return
    }
    createPaymentRateMutation.mutate({
      halfDayRateCents: half,
      fullDayRateCents: full,
    })
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardContent>
        <div className="text-center font-bold text-lg mb-2 text-secondary">
          <Text text={t.setPaymentRates} />
        </div>
        <div className="text-center mb-6">
          <Text text={t.setPaymentRatesDescription} />
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
                value={halfDayRate}
                onChange={(e) =>
                  handleRateChange(setHalfDayRate, e.target.value)
                }
                onBlur={(e) => handleBlur(setHalfDayRate, e.target.value)}
                placeholder="0.00"
              />
            </div>
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
                value={fullDayRate}
                onChange={(e) =>
                  handleRateChange(setFullDayRate, e.target.value)
                }
                onBlur={(e) => handleBlur(setFullDayRate, e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>
        </div>
        <Button onClick={handleSetPaymentRate} className="w-full mt-4">
          <Text text={t.setRatesButton} />
        </Button>
      </CardContent>
    </Card>
  )
}
