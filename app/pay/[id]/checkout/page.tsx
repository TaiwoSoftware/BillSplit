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

  const [bill, setBill] = useState<Bill | null>(null);
  const [participant, setParticipant] =
    useState<Participant | null>(null);

  const [email, setEmail] = useState("");

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

  async function verifyParticipant() {
    if (!email.trim()) {
      alert("Enter your email.");
      return;
    }

    setChecking(true);

    try {
      const { data, error } = await supabase
        .from("bill_participants")
        .select("*")
        .eq("bill_id", billId)
        .eq("email", email.trim())
        .maybeSingle();

      if (error || !data) {
        alert("Participant not found.");
        setParticipant(null);
        return;
      }

      setParticipant(data);
    } finally {
      setChecking(false);
    }
  }

  async function continuePayment() {
    if (!participant) return;

    setPaying(true);

    try {
      const response = await fetch("/api/nomba/checkout", {
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

      console.log("Checkout Response:", result);

      if (!response.ok) {
        alert(result.error || "Unable to create checkout.");
        return;
      }

      const checkoutLink = result.data?.checkoutLink;

      if (!checkoutLink) {
        console.error(result);
        alert("Checkout link was not returned.");
        return;
      }

      window.location.href = checkoutLink;
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setPaying(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10">
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 shadow-lg">

        <div className="flex items-center gap-3">
          <Wallet className="text-blue-600" />
          <h1 className="text-3xl font-bold">
            Bill Payment
          </h1>
        </div>

        <div className="mt-8 rounded-2xl bg-slate-50 p-6">
          <h2 className="text-2xl font-bold">
            {bill?.title}
          </h2>

          <p className="mt-2 text-slate-500">
            {bill?.description}
          </p>

          <p className="mt-6 text-3xl font-bold text-blue-600">
            ₦{Number(bill?.total_amount).toLocaleString()}
          </p>
        </div>

        <div className="mt-8">

          <label className="mb-2 block font-medium">
            Enter your email
          </label>

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

        {participant && (

          <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-6">

            <div className="flex items-center gap-2">
              <ShieldCheck className="text-green-600" />

              <h2 className="font-bold text-green-700">
                Participant Verified
              </h2>
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

            <div className="mt-6 rounded-xl bg-white p-5">

              <p className="text-sm text-slate-500">
                Amount to Pay
              </p>

              <h3 className="mt-2 text-3xl font-bold">
                ₦{Number(participant.amount).toLocaleString()}
              </h3>

            </div>

            <button
              onClick={continuePayment}
              disabled={paying}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-green-600 py-4 text-lg font-semibold text-white hover:bg-green-700 disabled:opacity-60"
            >
              {paying ? (
                <>
                  <Loader2 className="animate-spin" />
                  Redirecting...
                </>
              ) : (
                <>
                  Continue to Payment
                  <ArrowRight />
                </>
              )}
            </button>

          </div>

        )}

      </div>
    </div>
  );
}