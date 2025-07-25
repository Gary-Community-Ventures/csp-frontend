import { Button } from '@/components/ui/button'
import { usePaymentFlowContext } from './context'
import { useFamilyContext } from '../../wrapper'
import { useHideFamilyNavBar } from '@/lib/hooks'
import { findProviderById } from '@/lib/providers'
import { formatAmount } from '@/lib/currency'
import { useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'
import { paymentSchema } from '@/lib/schemas'

export default function ConfirmationPage() {
  useHideFamilyNavBar()
  const router = useRouter()
  const { paymentState, clearPaymentState } = usePaymentFlowContext()
  const { providers } = useFamilyContext()

  useEffect(() => {
    const result = paymentSchema.safeParse(paymentState)
    if (!result.success) {
      router.navigate({
        to: '/family/$childId/payment',
      })
    }
  }, [paymentState, router])

  const selectedProvider = findProviderById(
    providers,
    paymentState.providerId
  )

  const handleReturnHome = async () => {
    await router.navigate({ to: '/family' })
    clearPaymentState()
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex flex-grow justify-center p-4 sm:p-8">
        <div className="w-full max-w-md min-w-[300px]">
          <div className="items-center text-center">
            <h2 className="text-2xl font-bold mb-2">
              Payment Request Complete
            </h2>
            <p className="text-muted-foreground mb-6">
              Your payment request has been successfully submitted. A
              transaction will appear in your account once the payment has been
              processed.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-24 h-24 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-lg font-semibold mt-4">
              {formatAmount(paymentState.amount)}
            </p>
            <p className="text-sm text-muted-foreground">
              to {selectedProvider?.name || 'N/A'}
            </p>
            <p className="text-sm text-muted-foreground">
              for {paymentState.hours || '0'} hours
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center p-8 space-y-4 sm:space-y-0">
            <Button className="w-full sm:w-auto" onClick={handleReturnHome}>
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
