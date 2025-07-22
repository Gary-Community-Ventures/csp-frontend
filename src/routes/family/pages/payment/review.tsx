import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { makePaymentRequest } from "@/lib/requests";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { usePaymentFlowContext } from "./context";
import { useFamilyContext } from "../../wrapper";

export default function ReviewPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const { paymentState } = usePaymentFlowContext();
  const { providers } = useFamilyContext();

  const selectedProvider = providers.find(
    (p) => p.id.toString() === paymentState.providerId
  );

  const handlePayNow = async () => {
    // For now, we always navigate to confirmation regardless of request success/failure
    await makePaymentRequest(router.options.context, paymentState);
    navigate({ to: "/family/payment/confirmation" });
  };

  return (
    <div className="flex justify-center items-center h-full">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle>Review and Pay</CardTitle>
          <CardDescription>
            Please review the payment details below.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Childcare Center</p>
            <p className="text-sm font-medium">
              {selectedProvider?.name || "N/A"}
            </p>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Hours of Care</p>
            <p className="text-sm font-medium">{paymentState.hours || "N/A"}</p>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Amount</p>
            <p className="text-sm font-medium">${(paymentState.amount / 100).toFixed(2)}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate({ to: ".." })}>
            Back
          </Button>
          <Button onClick={handlePayNow}>Pay Now</Button>
        </CardFooter>
      </Card>
    </div>
  );
}