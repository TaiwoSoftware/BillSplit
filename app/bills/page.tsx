"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { supabase } from "@/app/lib/supabase";

import Navbar from "@/app/components/layout/Navbar";
import Sidebar from "@/app/components/layout/Sidebar";
import BillCard from "@/app/bills/BillCard";
import Button from "@/app/components/ui/Button";
import EmptyState from "@/app/components/ui/EmptyState";

import {
  Plus,
  Menu,
  X,
} from "lucide-react";

type Bill = {
  id: string;
  title: string;
  total_amount: number;
  status: string;
  created_at: string;
};

export default function BillsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("bills")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setBills(data || []);
    setLoading(false);
  };

  return (
    <>
      <Navbar />

      <div className="relative flex min-h-[calc(100vh-80px)] bg-slate-50">
        {/* Overlay */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          />
        )}

        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden p-5 md:p-8 lg:p-10">
          {/* Header */}
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <button
                onClick={() =>
                  setIsSidebarOpen((prev) => !prev)
                }
                className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:bg-slate-100 lg:hidden"
              >
                {isSidebarOpen ? (
                  <X size={22} />
                ) : (
                  <Menu size={22} />
                )}
              </button>

              <div>
                <h1 className="text-3xl font-bold md:text-4xl">
                  Bills 💸
                </h1>

                <p className="mt-2 text-sm text-slate-500 md:text-base">
                  Create and manage all your shared bills.
                </p>
              </div>
            </div>

            <Link
              href="/bills/create"
              className="w-full md:w-auto"
            >
              <Button className="w-full md:w-auto">
                <Plus size={20} />
                Create Bill
              </Button>
            </Link>
          </div>
         

          {/* Bills */}
          <section className="mt-10">
            {loading ? (
              <div className="flex justify-center py-20">
                <p className="text-slate-500">
                  Loading bills...
                </p>
              </div>
            ) : bills.length === 0 ? (
              <EmptyState
                title="No Bills Yet"
                description="Create your first bill and start collecting contributions."
              />
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {bills.map((bill) => (
                  <BillCard
                    key={bill.id}
                    id={bill.id}
                    title={bill.title}
                    collected={0}
                    target={bill.total_amount}
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
}