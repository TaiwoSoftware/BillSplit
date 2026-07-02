"use client";
import { supabase } from "@/app/lib/supabase";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/app/components/layout/Navbar";
import Sidebar from "@/app/components/layout/Sidebar";
import StatCard from "@/app/dashboard/StatCard";
import BillCard from "@/app/bills/BillCard";
import Button from "@/app/components/ui/Button";

import {
  Wallet,
  Receipt,
  Users,
  TrendingUp,
  Plus,
  Menu,
  X,
} from "lucide-react";
type Bill = {
  id: string;
  title: string;
  description: string | null;
  total_amount: number;
  status: string;
  created_at: string;
  owner_id: string;

  bill_participants?: {
    amount: number;
    payment_status: string;
  }[];

  collected: number;
  target: number;
};

type DashboardStats = {
  totalBills: number;
  activeBills: number;
  totalCollected: number;
  totalParticipants: number;
  completedBills: number;
  pendingPayments: number;
  completionRate: number;
};

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  const [bills, setBills] = useState<Bill[]>([]);

  const [stats, setStats] = useState<DashboardStats>({
    totalBills: 0,
    activeBills: 0,
    totalCollected: 0,
    totalParticipants: 0,
    completedBills: 0,
    pendingPayments: 0,
    completionRate: 0,
  });
  useEffect(() => {
    fetchDashboard();
  }, []);


  const fetchDashboard = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    // Bills
    const { data: billsData, error: billsError } =
      await supabase
        .from("bills")
        .select(`
    *,
    bill_participants(
      amount,
      payment_status
    )
  `)
        .eq("owner_id", user.id)
        .order("created_at", {
          ascending: false,
        });

    if (billsError) {
      console.error(billsError);
      setLoading(false);
      return;
    }

    const formattedBills =
      (billsData ?? []).map((bill) => {
        const collected =
          bill.bill_participants
            ?.filter(
              (participant: { payment_status: string; }) =>
                participant.payment_status === "paid"
            )
            .reduce(
              (sum: number, participant: { amount: any; }) =>
                sum + Number(participant.amount),
              0
            ) ?? 0;

        return {
          ...bill,
          collected,
          target: Number(bill.total_amount),
        };
      });

    setBills(formattedBills);

    const billIds =
      billsData?.map((bill) => bill.id) || [];

    // Participants
    const {
      data: participantData,
      error: participantError,
    } = await supabase
      .from("bill_participants")
      .select("*")
      .in("bill_id", billIds);

    if (participantError) {
      console.error(participantError);
    }

    const totalCollected =
      participantData
        ?.filter(
          (participant) =>
            participant.payment_status === "paid"
        )
        .reduce(
          (sum, participant) =>
            sum + Number(participant.amount),
          0
        ) || 0;

    const activeBills =
      billsData?.filter(
        (bill) => bill.status === "active"
      ).length || 0;

    const totalBills = billsData?.length || 0;

    const totalParticipants =
      participantData?.length || 0;

    const completedBills =
      billsData?.filter(
        (bill) => bill.status === "completed"
      ).length || 0;

    const pendingPayments =
      participantData?.filter(
        (participant) =>
          participant.payment_status !== "paid"
      ).length || 0;

    const totalTarget =
      billsData?.reduce(
        (sum, bill) =>
          sum + Number(bill.total_amount),
        0
      ) || 0;

    const completionRate =
      totalTarget === 0
        ? 0
        : Math.round(
          (totalCollected / totalTarget) *
          100
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
  console.log(bills);

  return (
    <>
      <Navbar />

      <div className="relative flex min-h-[calc(100vh-80px)] bg-slate-50">
        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            onClick={() =>
              setIsSidebarOpen(false)
            }
            className="
              fixed inset-0 z-40
              bg-black/40
              backdrop-blur-sm
              lg:hidden
            "
          />
        )}

        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() =>
            setIsSidebarOpen(false)
          }
        />

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden p-5 md:p-8 lg:p-10">
          {/* Header */}
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            {/* Left Section */}
            <div className="flex items-start gap-4">
              <button
                onClick={() =>
                  setIsSidebarOpen(
                    (prev) => !prev
                  )
                }
                className="
                  shrink-0
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  p-3
                  shadow-sm
                  transition
                  hover:bg-slate-100
                  lg:hidden
                "
              >
                {isSidebarOpen ? (
                  <X size={22} />
                ) : (
                  <Menu size={22} />
                )}
              </button>

              <div className="space-y-2">
                <h1 className="text-3xl font-bold md:text-4xl">
                  Dashboard 👋
                </h1>

                <p className="text-sm text-slate-500 md:text-base">
                  Manage your bills and track
                  contributions.
                </p>
              </div>
            </div>

            {/* Right Section */}
            <div className="w-full sm:w-auto">
              <Link href="/bills/create">
                <Button className="w-full sm:w-auto">
                  <Plus size={20} />
                  <span>Create Bill</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Collected"
              value={`₦${stats.totalCollected.toLocaleString()}`}
              icon={<Wallet size={28} />}
            />

            <StatCard
              title="Active Bills"
              value={stats.activeBills.toString()}
              icon={<Receipt size={28} />}
            />

            <StatCard
              title="Participants"
              value={stats.totalParticipants.toString()}
              icon={<Users size={28} />}
            />

            <StatCard
              title="Completion Rate"
              value={`${stats.completionRate}%`}
              icon={<TrendingUp size={28} />}
            />
          </section>

          {/* Recent Bills */}
          <section className="mt-14">
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {loading ? (
                <p className="text-slate-500">
                  Loading...
                </p>
              ) : bills.length === 0 ? (
                <p className="text-slate-500">
                  No bills yet.
                </p>
              ) : (
                bills.slice(0, 4).map((bill) => (
                  <BillCard
                    key={bill.id}
                    id={bill.id}
                    title={bill.title}
                    collected={bill.collected}
                    target={bill.target}
                  />
                ))
              )}
            </div>

          </section>
        </main>
      </div>
    </>
  );
}