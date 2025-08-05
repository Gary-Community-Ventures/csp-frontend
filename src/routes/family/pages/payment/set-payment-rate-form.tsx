import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { translations } from '@/translations/text'
import { Text, useText } from '@/translations/wrapper'
import React from 'react'
import { toast } from 'sonner'

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

  const handleSetPaymentRate = () => {
    const half = parseFloat(halfDayRate) * 100
    const full = parseFloat(fullDayRate) * 100

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
      <CardHeader>
        <CardTitle>
          <Text text={t.setPaymentRates} />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Text text={t.setPaymentRatesDescription} />
        <div className="space-y-2">
          <Label htmlFor="halfDayRate">
            <Text text={t.halfDayRate} />
          </Label>
          <Input
            id="halfDayRate"
            type="number"
            value={halfDayRate}
            onChange={(e) => setHalfDayRate(e.target.value)}
            placeholder="e.g., 25.00"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fullDayRate">
            <Text text={t.fullDayRate} />
          </Label>
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
