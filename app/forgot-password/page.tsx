"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";
import { ArrowLeft, Mail, Loader2, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const [error, setError] = useState("");

  const handleResetPassword = async () => {
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">

        <Link
          href="/login"
          className="mb-8 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft size={18} />
          Back to Login
        </Link>

        {!success ? (
          <>
            <div className="mb-8 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                <Mail className="text-blue-600" size={36} />
              </div>

              <h1 className="mt-6 text-3xl font-bold">
                Forgot Password?
              </h1>

              <p className="mt-3 text-slate-500">
                Enter your email address and we'll send you a password reset link.
              </p>
            </div>

            <div className="space-y-5">

              <div>
                <label className="mb-2 block font-medium">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600"
                />

                {error && (
                  <p className="mt-2 text-sm text-red-500">
                    {error}
                  </p>
                )}
              </div>

              <button
                onClick={handleResetPassword}
                disabled={loading}
                className="flex w-full items-center justify-center rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2
                      className="mr-2 animate-spin"
                      size={18}
                    />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>

            </div>
          </>
        ) : (
          <div className="text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle
                className="text-green-600"
                size={42}
              />
            </div>

            <h2 className="mt-6 text-3xl font-bold">
              Check Your Email
            </h2>

            <p className="mt-4 text-slate-500">
              We've sent a password reset link to
            </p>

            <p className="mt-2 font-semibold">
              {email}
            </p>

            <p className="mt-6 text-sm text-slate-500">
              If you don't see the email, check your spam or junk folder.
            </p>

            <Link
              href="/login"
              className="mt-8 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Back to Login
            </Link>

          </div>
        )}

      </div>
    </div>
  );
}