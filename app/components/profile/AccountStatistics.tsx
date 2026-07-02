"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

import {
  Receipt,
  Activity,
  Wallet,
  TrendingUp,
} from "lucide-react";

type Stats = {
  totalBills: number;
  activeBills: number;
  totalCollected: number;
  completionRate: number;
  totalParticipants: number;
  completedBills: number;
  pendingPayments: number;
};

export default function AccountStatistics() {
  const [stats, setStats] = useState<Stats>({
    totalBills: 0,
    activeBills: 0,
    totalCollected: 0,
    completionRate: 0,
    totalParticipants: 0,
    completedBills: 0,
    pendingPayments: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    // Fetch all bills belonging to the user
    const { data: bills, error: billsError } = await supabase
      .from("bills")
      .select("id,total_amount,status")
      .eq("owner_id", user.id);

    if (billsError) {
      console.error(billsError);
      setLoading(false);
      return;
    }

    const billIds = bills.map((bill) => bill.id);

    // Fetch participants
    const { data: participants, error: participantError } =
      await supabase
        .from("bill_participants")
        .select("amount,payment_status,bill_id")
        .in("bill_id", billIds);

    if (participantError) {
      console.error(participantError);
      setLoading(false);
      return;
    }

    const totalBills = bills.length;

    const activeBills = bills.filter(
      (bill) => bill.status === "active"
    ).length;

    const completedBills = bills.filter(
      (bill) => bill.status === "completed"
    ).length;

    const totalParticipants =
      participants?.length ?? 0;

    const pendingPayments =
      participants?.filter(
        (participant) =>
          participant.payment_status !== "paid"
      ).length ?? 0;

    const totalCollected =
      participants
        ?.filter(
          (participant) =>
            participant.payment_status === "paid"
        )
        .reduce(
          (sum, participant) =>
            sum + Number(participant.amount),
          0
        ) ?? 0;

    const totalTarget = bills.reduce(
      (sum, bill) =>
        sum + Number(bill.total_amount),
      0
    );

    const completionRate =
      totalTarget === 0
        ? 0
        : Math.round(
            (totalCollected / totalTarget) * 100
          );

    setStats({
      totalBills,
      activeBills,
      totalCollected,
      completionRate,
      totalParticipants,
      completedBills,
      pendingPayments,
    });

    setLoading(false);
  };

  if (loading) {
    return (
      <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-slate-500">
          Loading statistics...
        </p>
      </section>
    );
  }

  return (
    <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">
          Account Statistics
        </h2>

        <p className="mt-1 text-slate-500">
          Overview of your activity on BillSplit.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

        {/* Bills */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
            <Receipt className="text-blue-600" />
          </div>

          <h3 className="mt-6 text-4xl font-bold">
            {stats.totalBills}
          </h3>

          <p className="mt-2 text-slate-500">
            Bills Created
          </p>
        </div>

        {/* Active */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
            <Activity className="text-emerald-600" />
          </div>

          <h3 className="mt-6 text-4xl font-bold">
            {stats.activeBills}
          </h3>

          <p className="mt-2 text-slate-500">
            Active Bills
          </p>
        </div>

        {/* Money */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100">
            <Wallet className="text-yellow-600" />
          </div>

          <h3 className="mt-6 text-3xl font-bold">
            ₦{stats.totalCollected.toLocaleString()}
          </h3>

          <p className="mt-2 text-slate-500">
            Money Collected
          </p>
        </div>

        {/* Completion */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
            <TrendingUp className="text-purple-600" />
          </div>

          <h3 className="mt-6 text-4xl font-bold">
            {stats.completionRate}%
          </h3>

          <p className="mt-2 text-slate-500">
            Collection Success
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">

        <div className="rounded-2xl bg-blue-50 p-6">
          <p className="text-sm text-slate-500">
            Total Participants
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {stats.totalParticipants}
          </h3>
        </div>

        <div className="rounded-2xl bg-green-50 p-6">
          <p className="text-sm text-slate-500">
            Completed Bills
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {stats.completedBills}
          </h3>
        </div>

        <div className="rounded-2xl bg-orange-50 p-6">
          <p className="text-sm text-slate-500">
            Pending Payments
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {stats.pendingPayments}
          </h3>
        </div>

      </div>
    </section>
  );
}