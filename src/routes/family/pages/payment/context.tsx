import { createContext, useContext, useState } from "react";

interface PaymentFlowState {
  providerId: number;
  amount: number;
  hours: number;
}

interface PaymentFlowContextType {
  paymentState: PaymentFlowState;
  setPaymentState: React.Dispatch<React.SetStateAction<PaymentFlowState>>;
  resetPaymentState: () => void;
}

const PaymentFlowContext = createContext<PaymentFlowContextType | undefined>(undefined);

export function PaymentFlowProvider({ children }: { children: React.ReactNode }) {
  const [paymentState, setPaymentState] = useState<PaymentFlowState>({
    providerId: 0,
    amount: 0,
    hours: 0,
  });

  const resetPaymentState = () => {
    setPaymentState({
      providerId: 0,
      amount: 0,
      hours: 0,
    });
  };

  return (
    <PaymentFlowContext.Provider value={{ paymentState, setPaymentState, resetPaymentState }}>
      {children}
    </PaymentFlowContext.Provider>
  );
}

export function usePaymentFlowContext() {
  const context = useContext(PaymentFlowContext);
  if (context === undefined) {
    throw new Error("usePaymentFlowContext must be used within a PaymentFlowProvider");
  }
  return context;
}
