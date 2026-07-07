"use client";

import { Loader2 } from "lucide-react";

export default function PaymentLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="text-slate-600 font-medium">Verifying your payment...</p>
        <p className="text-sm text-slate-400">Please wait while we confirm your transaction</p>
      </div>
    </main>
  );
}