import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { usePaymentFlowContext } from './context'
import { useFamilyContext } from '../../wrapper'
import { useEffect, useState, useCallback } from 'react'

export default function PaymentPage() {
  const navigate = useNavigate()
  const { paymentState, setPaymentState } = usePaymentFlowContext()
  const [displayAmount, setDisplayAmount] = useState<string>('')
  const [isFormValid, setIsFormValid] = useState(false)
  const { providers } = useFamilyContext()
  const { providerId } = useSearch({
    from: '/family/payment',
  }) as { providerId?: number }

  useEffect(() => {
    if (providerId && providers.length > 0) {
      const provider = providers.find((p) => p.id === providerId)
      if (provider) {
        setPaymentState((prev) => ({
          ...prev,
          providerId: provider.id,
        }))
      }
    }
  }, [providerId, providers, setPaymentState])

  const validateForm = useCallback(() => {
    const isValid =
      paymentState.amount > 0 &&
      paymentState.hours > 0 &&
      paymentState.providerId !== null
    setIsFormValid(isValid)
  }, [paymentState.amount, paymentState.hours, paymentState.providerId])

  useEffect(() => {

    validateForm()
  }, [validateForm])

  const handleContinue = () => {
    if (isFormValid) {
      navigate({ to: '/family/payment/review' })
    }
  }

  return (
    <div className="flex justify-center items-center h-full">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle>Pay Provider</CardTitle>
          <CardDescription>
            Please fill out the information below to make a payment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="childcare-center">Childcare Center</Label>
                <Select
                  value={paymentState.providerId?.toString() || ''}
                  onValueChange={(value) =>
                    setPaymentState((prev) => ({
                      ...prev,
                      providerId: value
                        ? parseInt(value, 10)
                        : paymentState.providerId,
                    }))
                  }
                >
                  <SelectTrigger id="childcare-center">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {providers.map((provider) => (
                      <SelectItem
                        key={provider.id}
                        value={provider.id.toString()}
                      >
                        {provider.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="text"
                  placeholder="e.g., 100.00"
                  value={displayAmount}
                  onChange={(e) => {
                    const value = e.target.value
                    const cleanedValue = value.replace(/[^\d.]/g, '') // Allow only numbers and a single decimal point
                    setDisplayAmount(cleanedValue)

                    const parsedValue = parseFloat(cleanedValue)
                    setPaymentState((prev) => ({
                      ...prev,
                      amount: isNaN(parsedValue)
                        ? 0
                        : Math.round(parsedValue * 100),
                    }))
                  }}
                  onFocus={(e) => {
                    // Remove dollar sign when focused
                    setDisplayAmount(e.target.value.replace(/[^\d.]/g, ''))
                  }}
                  onBlur={() => {
                    // Add dollar sign and format to 2 decimal places when blurred
                    const formatted = (paymentState.amount / 100).toFixed(2)
                    setDisplayAmount(`${formatted}`)
                  }}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="hours">Number of Care Hours</Label>
                <Input
                  id="hours"
                  placeholder="e.g., 8"
                  value={paymentState.hours === 0 ? '' : paymentState.hours}
                  onChange={(e) =>
                    setPaymentState((prev) => ({
                      ...prev,
                      hours: parseFloat(e.target.value) || 0,
                    }))
                  }
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate({ to: '..' })}>
            Cancel
          </Button>
          <Button onClick={handleContinue} disabled={!isFormValid}>
            Continue
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
