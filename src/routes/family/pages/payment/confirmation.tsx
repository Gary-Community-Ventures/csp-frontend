import { Button } from '@/components/ui/button'

import { useNavigate } from '@tanstack/react-router'
import { usePaymentFlowContext } from './context'
import { useFamilyContext } from '../../wrapper'

export default function ConfirmationPage() {
  const navigate = useNavigate()
  const { paymentState, resetPaymentState } = usePaymentFlowContext()
  const { providers } = useFamilyContext()

  const selectedProvider = providers.find(
    (p) => p.id === paymentState.providerId
  )

  const handleReturnToHome = () => {
    resetPaymentState()
    navigate({ to: '/family' })
  }

  const { selectedChildInfo } = useFamilyContext()

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="w-full bg-primary p-5 flex justify-center items-center">
        <strong className="text-3xl text-white">
          {selectedChildInfo.firstName} {selectedChildInfo.lastName}
        </strong>
      </div>
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
              ${(paymentState.amount / 100).toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">
              to {selectedProvider?.name || 'N/A'}
            </p>
            <p className="text-sm text-muted-foreground">
              for {paymentState.hours || '0'} hours
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center p-8 space-y-4 sm:space-y-0">
            <Button onClick={handleReturnToHome} className="w-full sm:w-auto">
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
