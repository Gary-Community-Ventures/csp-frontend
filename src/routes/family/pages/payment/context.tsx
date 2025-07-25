import { createContext, useContext, useState, useCallback } from 'react'

type PaymentFlowState = {
  providerId: number
  amount: number
  hours: number
}

type PaymentFlowContextType = {
  paymentState: PaymentFlowState
  setPaymentState: React.Dispatch<React.SetStateAction<PaymentFlowState>>
  clearPaymentState: () => void
}

const PaymentFlowContext = createContext<PaymentFlowContextType | undefined>(
  undefined
)

export function PaymentFlowProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [paymentState, setPaymentState] = useState<PaymentFlowState>({
    providerId: 0,
    amount: 0,
    hours: 0,
  })

  const clearPaymentState = useCallback(() => {
    setPaymentState({
      providerId: 0,
      amount: 0,
      hours: 0,
    })
  }, [])

  return (
    <PaymentFlowContext.Provider
      value={{ paymentState, setPaymentState, clearPaymentState }}
    >
      {children}
    </PaymentFlowContext.Provider>
  )
}

export const usePaymentFlowContext = () => {
  const context = useContext(PaymentFlowContext)
  if (context === undefined) {
    throw new Error(
      'usePaymentFlowContext must be used within a PaymentFlowProvider'
    )
  }
  return context
}
