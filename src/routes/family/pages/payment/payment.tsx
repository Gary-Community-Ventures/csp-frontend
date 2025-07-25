import { Button } from '@/components/ui/button'

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
import { useEffect, useState } from 'react'
import { useHideFamilyNavBar } from '@/lib/hooks'
import { Link } from '@tanstack/react-router'
import { z } from 'zod'
import { paymentSchema } from '@/lib/schemas'

export default function PaymentPage() {
  useHideFamilyNavBar()
  const navigate = useNavigate()
  const { paymentState, setPaymentState } = usePaymentFlowContext()
  const [displayAmount, setDisplayAmount] = useState<string>('')
  const [isFormValid, setIsFormValid] = useState(false)
  const [errors, setErrors] = useState<z.ZodIssue[]>([])
  const [showErrors, setShowErrors] = useState(false)
  const { providers } = useFamilyContext()
  const { providerId: providerIdParam } = useSearch({
    from: '/family/$childId/payment',
  })

  useEffect(() => {
    if (providerIdParam && providers.length > 0) {
      const provider = providers.find((p) => p.id === providerIdParam)
      if (provider) {
        setPaymentState((prev) => ({
          ...prev,
          providerId: provider.id,
        }))
      }
    }
  }, [providerIdParam, providers, setPaymentState])

  useEffect(() => {
    const result = paymentSchema.safeParse(paymentState)
    setIsFormValid(result.success)
  }, [paymentState])

  const handleContinue = () => {
    setShowErrors(true)
    const result = paymentSchema.safeParse(paymentState)
    if (result.success) {
      navigate({ to: '/family/$childId/payment/review' })
    } else {
      setErrors(result.error.issues)
    }
  }

  const getErrorMessage = (path: string) => {
    return errors.find((err) => err.path[0] === path)?.message
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex flex-grow justify-center items-center h-full">
        <div className="w-full max-w-md min-w-[300px] bg-white p-6 sm:p-8 h-full">
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5 min-h-16">
                <Label htmlFor="childcare-center">Provider</Label>
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
                  <SelectTrigger id="childcare-center" className="w-full h-14">
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
                {showErrors && getErrorMessage('providerId') && (
                  <p className="text-red-500 text-sm mt-1">
                    {getErrorMessage('providerId')}
                  </p>
                )}
              </div>
              <div className="flex flex-col space-y-1.5 min-h-16">
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
                {showErrors && getErrorMessage('amount') && (
                  <p className="text-red-500 text-sm mt-1">
                    {getErrorMessage('amount')}
                  </p>
                )}
              </div>
              <div className="flex flex-col space-y-1.5 min-h-16">
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
                {showErrors && getErrorMessage('hours') && (
                  <p className="text-red-500 text-sm mt-1">
                    {getErrorMessage('hours')}
                  </p>
                )}
              </div>
            </div>
          </form>
          <div className="flex flex-col sm:flex-row justify-between mt-8 space-y-4 sm:space-y-0 sm:space-x-4">
            <Button variant="outline" className="w-full sm:w-auto" asChild>
              <Link to="/family/$childId/home">Cancel</Link>
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!isFormValid}
              className="w-full sm:w-auto"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
