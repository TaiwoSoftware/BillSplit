"use client";

import Link from "next/link";
import { CheckCircle, ArrowRight, Calendar, Users, CreditCard } from "lucide-react";

interface PaymentSuccessProps {
  orderReference: string;
  amount?: number;
  billTitle?: string;
  date?: string;
}

export default function PaymentSuccess({ 
  orderReference, 
  amount, 
  billTitle,
  date 
}: PaymentSuccessProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50 px-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 md:p-10 shadow-xl border border-slate-100">
        {/* Success Animation */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-green-400 opacity-25" />
            <div className="relative rounded-full bg-gradient-to-br from-green-400 to-green-600 p-4 shadow-lg shadow-green-200">
              <CheckCircle className="h-16 w-16 text-white" />
            </div>
          </div>
        </div>

        <h1 className="mt-6 text-center text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Payment Successful! 🎉
        </h1>

        <p className="mt-3 text-center text-slate-500 text-lg">
          Thank you for your contribution
        </p>

        {/* Payment Details Card */}
        <div className="mt-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-6 border border-green-200">
          <div className="space-y-4">
            {billTitle && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Bill</span>
                <span className="font-semibold text-slate-800">{billTitle}</span>
              </div>
            )}
            
            {amount && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Amount Paid</span>
                <span className="text-2xl font-bold text-green-600">
                  ₦{amount.toLocaleString()}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Order Reference</span>
              <span className="font-mono text-sm text-green-700 bg-white/50 px-3 py-1 rounded-lg">
                {orderReference}
              </span>
            </div>

            {date && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Date</span>
                <span className="text-sm text-slate-800">{date}</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-2 gap-3">
          <Link
            href="/bills"
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-white font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
          >
            <span>View Bills</span>
            <ArrowRight size={18} />
          </Link>
          
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
          >
            <Users size={18} />
            <span>Dashboard</span>
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-6 flex items-center justify-center gap-6 text-sm text-slate-400">
          <span className="flex items-center gap-1">
            <CreditCard size={14} />
            Secure Payment
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={14} />
            Confirmed
          </span>
        </div>
      </div>
    </main>
  );
}