"use client";

import { useState } from "react";
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

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);

  const bills = [
    {
      id: "1",
      title: "Birthday Dinner",
      collected: 25000,
      target: 30000,
    },
    {
      id: "2",
      title: "Department Project",
      collected: 80000,
      target: 100000,
    },
  ];

  return (
    <>
      <Navbar />

      <div className="relative flex min-h-[calc(100vh-80px)] bg-slate-50">
        {/* Overlay */}
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
            {/* Left */}
            <div className="flex items-start gap-4">
              <button
                onClick={() =>
                  setIsSidebarOpen(
                    (prev) => !prev
                  )
                }
                className="
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

              <div>
                <h1 className="text-3xl font-bold md:text-4xl">
                  Dashboard 👋
                </h1>

                <p className="mt-2 text-sm text-slate-500 md:text-base">
                  Manage your bills and track
                  contributions.
                </p>
              </div>
            </div>

            {/* Right */}
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

          {/* Stats */}
          <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Collected"
              value="₦105,000"
              icon={<Wallet size={28} />}
            />

            <StatCard
              title="Active Bills"
              value="2"
              icon={<Receipt size={28} />}
            />

            <StatCard
              title="Contributors"
              value="15"
              icon={<Users size={28} />}
            />

            <StatCard
              title="Completion Rate"
              value="81%"
              icon={<TrendingUp size={28} />}
            />
          </section>

          {/* Recent Bills */}
          <section className="mt-14">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                Recent Bills
              </h2>

              <Link
                href="/bills"
                className="
                  font-medium
                  text-blue-600
                  transition
                  hover:text-blue-700
                "
              >
                View All
              </Link>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {bills.map((bill) => (
                <BillCard
                  key={bill.id}
                  id={bill.id}
                  title={bill.title}
                  collected={bill.collected}
                  target={bill.target}
                />
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}