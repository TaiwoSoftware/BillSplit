"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import {
  Wallet,
  Mail,
  User,
  ArrowRight,
  Loader2,
  ShieldCheck,
  LockKeyhole,
} from "lucide-react";

type Bill = {
  id: string;
  title: string;
  description: string;
  total_amount: number;
};

type Participant = {
  id: string;
  name: string;
  email: string;
  amount: number;
  payment_status: string;
};

export default function Page() {
  const params = useParams();
  const billId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [paying, setPaying] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const [bill, setBill] = useState<Bill | null>(null);
  const [participant, setParticipant] = useState<Participant | null>(null);

  const [email, setEmail] = useState("");

  // Payment OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (billId) {
      fetchBill();
    }
  }, [billId]);

  async function fetchBill() {
    try {
      const { data, error } = await supabase
        .from("bills")
        .select("*")
        .eq("id", billId)
        .single();

      if (error) {
        console.error(error);
        alert("Unable to load bill.");
        return;
      }

      setBill(data);
    } finally {
      setLoading(false);
    }
  }

  // --------------------------------------------------
  // STEP 1:
  // Find the participant
  // --------------------------------------------------

  async function verifyParticipant() {
    if (!email.trim()) {
      alert("Enter your email.");
      return;
    }

    setChecking(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      const { data, error } = await supabase
        .from("bill_participants")
        .select("*")
        .eq("bill_id", billId)
        .eq("email", normalizedEmail)
        .maybeSingle();

      if (error) {
        console.error(error);
        alert("Unable to verify participant.");
        setParticipant(null);
        return;
      }

      if (!data) {
        alert("Participant not found.");
        setParticipant(null);
        return;
      }

      setParticipant(data);
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setChecking(false);
    }
  }

  // --------------------------------------------------
  // STEP 2:
  // Send OTP when user wants to pay
  // --------------------------------------------------

  async function continuePayment() {
    if (!participant) {
      alert("Please verify your participant information first.");
      return;
    }

    if (participant.payment_status === "paid") {
      alert("This contribution has already been paid.");
      return;
    }

    setPaying(true);

    try {
      const response = await fetch("/api/payment/request-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          billId,
          participantId: participant.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Unable to send verification code.");
        return;
      }

      setOtpSent(true);
      setOtp("");

      alert(`A verification code has been sent to ${participant.email}.`);
    } catch (error) {
      console.error(error);
      alert("Unable to send verification code.");
    } finally {
      setPaying(false);
    }
  }

  // --------------------------------------------------
  // STEP 3:
  // Verify OTP
  // --------------------------------------------------

  async function verifyPaymentOtp() {
    const enteredOtp = otp.trim();

    if (!enteredOtp) {
      alert("Enter the verification code.");
      return;
    }

    if (!/^\d{6}$/.test(enteredOtp)) {
      alert("Enter the 6-digit verification code.");
      return;
    }

    if (!participant) {
      alert("Participant information is missing.");
      return;
    }

    setVerifyingOtp(true);

    try {
      // -----------------------------------------------
      // 1. Verify OTP
      // -----------------------------------------------

      const response = await fetch("/api/payment/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          billId,
          participantId: participant.id,
          otp: enteredOtp,
        }),
      });

      // Prevent JSON parsing errors if the API returns HTML
      const contentType = response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        const text = await response.text();

        console.error("Unexpected OTP verification response:", text);

        alert("The verification server returned an unexpected response.");

        return;
      }

      const result = await response.json();

      if (!response.ok || !result.verified) {
        alert(result.error || "Invalid or expired verification code.");

        return;
      }

      console.log("OTP verified successfully.");

      // -----------------------------------------------
      // 2. Initialize Paystack
      // -----------------------------------------------

      const paymentResponse = await fetch("/api/payment/paystack/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          billId,
          participantId: participant.id,
        }),
      });

      // Prevent another "<!DOCTYPE..." JSON error
      const paymentContentType = paymentResponse.headers.get("content-type");

      if (!paymentContentType?.includes("application/json")) {
        const text = await paymentResponse.text();

        console.error("Unexpected Paystack response:", text);

        alert("The payment server returned an unexpected response.");

        return;
      }

      const paymentResult = await paymentResponse.json();

      if (!paymentResponse.ok) {
        alert(paymentResult.error || "Unable to initialize payment.");

        return;
      }

      const checkoutUrl = paymentResult.checkoutUrl;

      if (!checkoutUrl) {
        console.error("Paystack response:", paymentResult);

        alert("Payment checkout link was not returned.");

        return;
      }

      // -----------------------------------------------
      // 3. Redirect to Paystack
      // -----------------------------------------------

      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Payment verification error:", error);

      alert("Something went wrong while verifying your payment.");
    } finally {
      setVerifyingOtp(false);
    }
  }

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-slate-100 py-10">
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 shadow-lg">
        {/* Header */}

        <div className="flex items-center gap-3">
          <Wallet className="text-blue-600" />

          <h1 className="text-3xl font-bold">Bill Payment</h1>
        </div>

        {/* Bill information */}

        <div className="mt-8 rounded-2xl bg-slate-50 p-6">
          <h2 className="text-2xl font-bold">{bill?.title}</h2>

          <p className="mt-2 text-slate-500">{bill?.description}</p>

          <p className="mt-6 text-3xl font-bold text-blue-600">
            ₦{Number(bill?.total_amount).toLocaleString()}
          </p>
        </div>

        {/* Participant email */}

        {!participant && (
          <div className="mt-8">
            <label className="mb-2 block font-medium">Enter your email</label>

            <div className="flex items-center rounded-xl border px-4">
              <Mail size={18} />

              <input
                type="email"
                placeholder="example@gmail.com"
                className="w-full p-4 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              onClick={verifyParticipant}
              disabled={checking}
              className="mt-5 w-full rounded-xl bg-blue-600 py-4 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {checking ? (
                <Loader2 className="mx-auto animate-spin" />
              ) : (
                "Verify Participant"
              )}
            </button>
          </div>
        )}

        {/* Participant */}

        {participant && !otpSent && (
          <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-green-600" />

              <h2 className="font-bold text-green-700">Participant Verified</h2>
            </div>

            <div className="mt-5 space-y-4">
              <div className="flex items-center gap-3">
                <User size={18} />

                <span>{participant.name}</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={18} />

                <span>{participant.email}</span>
              </div>
            </div>

            {/* Amount */}

            <div className="mt-6 rounded-xl bg-white p-5">
              <p className="text-sm text-slate-500">Amount to Pay</p>

              <h3 className="mt-2 text-3xl font-bold">
                ₦{Number(participant.amount).toLocaleString()}
              </h3>
            </div>

            {/* Continue */}

            <button
              onClick={continuePayment}
              disabled={paying || participant.payment_status === "paid"}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-green-600 py-4 text-lg font-semibold text-white hover:bg-green-700 disabled:opacity-60"
            >
              {paying ? (
                <>
                  <Loader2 className="animate-spin" />
                  Sending verification code...
                </>
              ) : participant.payment_status === "paid" ? (
                "Already Paid"
              ) : (
                <>
                  Continue to Payment
                  <ArrowRight />
                </>
              )}
            </button>
          </div>
        )}

        {/* OTP */}

        {participant && otpSent && (
          <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6">
            <div className="flex items-center gap-2">
              <LockKeyhole className="text-blue-600" />

              <h2 className="font-bold text-blue-700">Verify Payment</h2>
            </div>

            <p className="mt-3 text-sm text-slate-600">
              We've sent a 6-digit verification code to:
            </p>

            <p className="mt-1 font-semibold">{participant.email}</p>

            <div className="mt-6">
              <label className="mb-2 block font-medium">
                Enter verification code
              </label>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="w-full rounded-xl border bg-white p-4 text-center text-2xl font-semibold tracking-[0.5em] outline-none focus:border-blue-600"
              />
            </div>

            <button
              onClick={verifyPaymentOtp}
              disabled={verifyingOtp || otp.length !== 6}
              className="mt-5 flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 py-4 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {verifyingOtp ? (
                <>
                  <Loader2 className="animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify & Continue to Payment
                  <ArrowRight />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setOtpSent(false);
                setOtp("");
              }}
              className="mt-4 w-full text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
