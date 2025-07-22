
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { usePaymentFlowContext } from "./context";
import { useFamilyContext } from "../../wrapper";

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const { paymentState, resetPaymentState } = usePaymentFlowContext();
  const { providers } = useFamilyContext();

  const selectedProvider = providers.find(
    (p) => p.id === paymentState.providerId
  );

  const handleReturnToHome = () => {
    resetPaymentState();
    navigate({ to: "/family" });
  };

  return (
    <div className="flex justify-center items-center h-full">
      <Card className="w-[450px]">
        <CardHeader className="items-center">
          <CardTitle>Payment Complete</CardTitle>
          <CardDescription>
            Your payment has been successfully processed.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-24 h-24 text-green-500"
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
          <p className="text-lg font-semibold mt-4">${paymentState.amount || "0.00"}</p>
          <p className="text-sm text-muted-foreground">
            to {selectedProvider?.name || "N/A"}
          </p>
          <p className="text-sm text-muted-foreground">
            for {paymentState.hours || "0"} hours
          </p>
        </CardContent>
        <div className="flex justify-center p-6">
          <Button onClick={handleReturnToHome}>Return to Home</Button>
        </div>
      </Card>
    </div>
  );
}
