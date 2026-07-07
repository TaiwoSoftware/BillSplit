"use client";

import { useSearchParams } from "next/navigation";
import { format } from "date-fns";

import PaymentLoading from "@/app/components/payment/PaymentLoading";
import PaymentFailed from "@/app/components/payment/PaymentFailed";
import PaymentSuccess from "@/app/components/payment/PaymentSuccess";
import { usePaymentVerification } from "@/app/hooks/usePaymentVerification";

export default function PaymentSuccessContent() {
  const searchParams = useSearchParams();

  const orderReference = searchParams.get("orderId");
  const amount = searchParams.get("amount");
  const billTitle = searchParams.get("title");

  const { loading, verified, error, data } =
    usePaymentVerification(orderReference);

  const handleRetry = () => {
    window.location.reload();
  };

  if (loading) {
    return <PaymentLoading />;
  }

  if (!verified || error) {
    return (
      <PaymentFailed
        errorMessage={error || undefined}
        onRetry={handleRetry}
      />
    );
  }

  return (
    <PaymentSuccess
      orderReference={orderReference || ""}
      amount={amount ? parseFloat(amount) : undefined}
      billTitle={billTitle || undefined}
      date={data?.date ? format(new Date(data.date), "PPP") : undefined}
    />
  );
}