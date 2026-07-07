"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";

import PaymentLoading from "@/app/components/payment/PaymentLoading";
import PaymentFailed from "@/app/components/payment/PaymentFailed";
import PaymentSuccess from "@/app/components/payment/PaymentSuccess";
import { usePaymentVerification } from "@/app/hooks/usePaymentVerification";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const orderReference = searchParams.get("orderId");
  const amount = searchParams.get("amount");
  const billTitle = searchParams.get("title");

  const { loading, verified, error, data } = usePaymentVerification(orderReference);

  // Handle retry
  const handleRetry = () => {
    window.location.reload();
  };

  // Show loading state
  if (loading) {
    return <PaymentLoading />;
  }

  // Show failed state
  if (!verified || error) {
    return (
      <PaymentFailed 
        errorMessage={error || undefined}
        onRetry={handleRetry}
      />
    );
  }

  // Show success state
  return (
  <>
   <Suspense fallback={<PaymentLoading />}>
      <PaymentSuccess 
        orderReference={orderReference || ""}
        amount={amount ? parseFloat(amount) : undefined}
        billTitle={billTitle || undefined}
        date={data?.date ? format(new Date(data.date), "PPP") : undefined}
      />
    </Suspense>
  </>
  );
}