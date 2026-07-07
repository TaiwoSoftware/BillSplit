import { Suspense } from "react";

import PaymentLoading from "@/app/components/payment/PaymentLoading";
import PaymentSuccessContent from "@/app/components/payment/PaymentSuccessContent";

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentLoading />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}