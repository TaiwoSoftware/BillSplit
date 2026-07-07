"use client";

import Link from "next/link";
import { XCircle, AlertTriangle } from "lucide-react";

interface PaymentFailedProps {
  errorMessage?: string;
  onRetry?: () => void;
}

export default function PaymentFailed({ 
  errorMessage = "We couldn't verify your payment.",
  onRetry 
}: PaymentFailedProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-lg text-center">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-red-400 opacity-25" />
            <XCircle className="h-20 w-20 text-red-500 relative" />
          </div>
        </div>

        <h1 className="mt-6 text-3xl font-bold text-red-600">
          Payment Verification Failed
        </h1>

        <p className="mt-3 text-slate-600">
          {errorMessage}
        </p>

        <div className="mt-6 flex flex-col gap-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="rounded-xl bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          )}
          
          <Link
            href="/"
            className="rounded-xl border border-slate-200 px-6 py-3 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}