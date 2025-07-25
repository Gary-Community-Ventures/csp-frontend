import { Button } from '@/components/ui/button'

import { Separator } from '@/components/ui/separator'
import { makePaymentRequest } from '@/lib/requests'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { usePaymentFlowContext } from './context'
import { useFamilyContext } from '../../wrapper'
import { useHideFamilyNavBar } from '@/lib/hooks'
import { Link } from '@tanstack/react-router'
import { paymentSchema } from '@/lib/schemas'
import { formatAmount } from '@/lib/currency'

export default function ReviewPage() {
  useHideFamilyNavBar()
  const navigate = useNavigate()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { paymentState } = usePaymentFlowContext()

  useEffect(() => {
    const result = paymentSchema.safeParse(paymentState)
    if (!result.success) {
      toast.error("Invalid payment details. Please go back and correct them.")
      navigate({ to: '/family/$childId/payment' })
    }
  }, [paymentState, navigate])
  const { providers, selectedChildInfo } = useFamilyContext()

  const selectedProvider = providers.find(
    (p) => p.id === paymentState.providerId
  )

  const handlePayNow = async () => {
    setIsLoading(true)
    try {
      // Ensure providerId is not null before making the payment request
      if (paymentState.providerId === null) {
        navigate({ to: '/family/$childId/payment' })
        throw new Error('Provider ID is required to make a payment.')
      }
      await makePaymentRequest(router.options.context, {
        amount: paymentState.amount,
        providerId: paymentState.providerId,
        hours: paymentState.hours,
        childId: selectedChildInfo.id,
      })
      navigate({ to: '/family/$childId/payment/confirmation' })
    } catch (error) {
      console.error('Payment request failed:', error)
      toast.error('Failed to process payment request. Please try again.', {
        style: {
          background: 'var(--destructive)',
          color: 'var(--primary-foreground)',
          border: '1px solid var(--destructive)',
        },
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex flex-grow justify-center p-4 sm:p-8">
        <div className="w-full max-w-md min-w-[300px]">
          <h2 className="text-2xl font-bold text-center mb-8 text-secondary">
            Review and Pay
          </h2>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Provider</p>
              <p className="text-sm font-medium">
                {selectedProvider?.name || 'N/A'}
              </p>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="text-sm font-medium">
                {formatAmount(paymentState.amount)}
              </p>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Hours of Care</p>
              <p className="text-sm font-medium">
                {paymentState.hours || 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between mt-8 space-y-4 sm:space-y-0">
            <Button variant="outline" className="w-full sm:w-auto" asChild>
              <Link to="..">Back</Link>
            </Button>
            <Button
              onClick={handlePayNow}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? 'Processing...' : 'Pay Now'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
