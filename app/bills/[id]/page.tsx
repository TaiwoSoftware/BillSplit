"use client";

import { useState } from "react";
import Link from "next/link";

import Navbar from "@/app/components/layout/Navbar";
import Sidebar from "@/app/components/layout/Sidebar";
import Button from "@/app/components/ui/Button";

import {
  Menu,
  X,
  Users,
  CreditCard,
  Landmark,
  Calendar,
  Clock,
  Pencil,
  Trash2,
  Share2,
} from "lucide-react";

export default function BillDetailsPage() {
  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);

  const bill = {
    id: "1",
    title: "Birthday Dinner 🎉",
    description:
      "Contributions for dinner at Chicken Republic.",
    collected: 25000,
    target: 30000,
    dueDate: "10 July 2026",
    createdAt: "25 June 2026",
    status: "Active",
    splitType: "Equal Split",

    participants: [
      {
        id: "1",
        name: "Taiwo David",
        email: "taiwo@gmail.com",
        amount: 5000,
        paid: true,
      },
      {
        id: "2",
        name: "John Doe",
        email: "john@gmail.com",
        amount: 5000,
        paid: false,
      },
      {
        id: "3",
        name: "Mary Jane",
        email: "mary@gmail.com",
        amount: 5000,
        paid: true,
      },
    ],
  };

  const progress = Math.min(
    (bill.collected / bill.target) * 100,
    100
  );

  const copyLink = async () => {
    await navigator.clipboard.writeText(
      `https://billsplit.com/bills/${bill.id}`
    );

    alert("Bill link copied!");
  };

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

        {/* Main */}
        <main className="flex-1 overflow-x-hidden p-5 md:p-8 lg:p-10">
          {/* Header */}
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
                {bill.title}
              </h1>

              <p className="mt-2 text-slate-500">
                {bill.description}
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="mt-8 flex flex-wrap gap-4">
            <div
              className={`
                rounded-xl px-4 py-2
                text-sm font-medium
                ${
                  bill.status ===
                  "Completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }
              `}
            >
              {bill.status}
            </div>

            <div
              className="
                flex items-center gap-2
                rounded-xl bg-white
                px-4 py-2 shadow-sm
              "
            >
              <Calendar size={18} />
              <span>{bill.createdAt}</span>
            </div>

            <div
              className="
                flex items-center gap-2
                rounded-xl bg-white
                px-4 py-2 shadow-sm
              "
            >
              <Clock size={18} />
              <span>
                Due: {bill.dueDate}
              </span>
            </div>
          </div>

          {/* Progress */}
          <section className="mt-10 rounded-3xl bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                Contribution Progress
              </h2>

              <span className="font-semibold text-blue-600">
                {progress.toFixed(0)}%
              </span>
            </div>

            <div className="mt-6 h-4 overflow-hidden rounded-full bg-slate-200">
              <div
                className="
                  h-full rounded-full
                  bg-blue-600
                  transition-all
                  duration-500
                "
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            <div className="mt-6 flex justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Collected
                </p>

                <p className="text-2xl font-bold">
                  ₦
                  {bill.collected.toLocaleString()}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-slate-500">
                  Target
                </p>

                <p className="text-2xl font-bold">
                  ₦
                  {bill.target.toLocaleString()}
                </p>
              </div>
            </div>
          </section>

          {/* Participants */}
          <section className="mt-10 rounded-3xl bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-center gap-3">
              <Users />
              <h2 className="text-xl font-bold">
                Participants
              </h2>
            </div>

            <div className="mt-6 space-y-4">
              {bill.participants.map(
                (participant) => (
                  <div
                    key={participant.id}
                    className="
                      flex flex-col gap-4
                      rounded-2xl border
                      p-5
                      md:flex-row
                      md:items-center
                      md:justify-between
                    "
                  >
                    <div>
                      <h3 className="font-semibold">
                        {participant.name}
                      </h3>

                      <p className="text-sm text-slate-500">
                        {participant.email}
                      </p>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="font-semibold">
                        ₦
                        {participant.amount.toLocaleString()}
                      </p>

                      <span
                        className={`text-sm ${
                          participant.paid
                            ? "text-green-600"
                            : "text-orange-500"
                        }`}
                      >
                        {participant.paid
                          ? "Paid"
                          : "Pending"}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          </section>

          {/* Breakdown */}
          <section className="mt-10 rounded-3xl bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-xl font-bold">
              Contribution Breakdown
            </h2>

            <div className="mt-6">
              <p className="text-slate-500">
                {bill.splitType}
              </p>

              <p className="mt-2 text-3xl font-bold">
                ₦
                {Math.floor(
                  bill.target /
                    bill.participants.length
                ).toLocaleString()}
              </p>

              <p className="mt-2 text-slate-500">
                Per participant
              </p>
            </div>
          </section>

          {/* Payment Methods */}
          <section className="mt-10 rounded-3xl bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-xl font-bold">
              Payment Methods
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div
                className="
                  flex items-center gap-4
                  rounded-2xl border p-6
                "
              >
                <CreditCard />
                Card Payments
              </div>

              <div
                className="
                  flex items-center gap-4
                  rounded-2xl border p-6
                "
              >
                <Landmark />
                Bank Transfer
              </div>
            </div>
          </section>

          {/* Share */}
          <section className="mt-10 rounded-3xl bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-xl font-bold">
              Share Bill
            </h2>

            <div className="mt-6 flex flex-col gap-4 md:flex-row">
              <input
                readOnly
                value={`https://billsplit.com/bills/${bill.id}`}
                className="
                  flex-1 rounded-xl
                  border border-slate-300
                  bg-slate-50
                  px-4 py-3
                  outline-none
                "
              />

              <Button
                onClick={copyLink}
              >
                <Share2 size={18} />
                Copy Link
              </Button>
            </div>
          </section>

          {/* Actions */}
          <section className="mt-10 rounded-3xl bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-xl font-bold">
              Actions
            </h2>

            <div
              className="
                mt-6 flex flex-col
                gap-4
                md:flex-row
              "
            >
              <Button>
                <Pencil size={18} />
                Edit Bill
              </Button>

              <Button variant="outline">
                Send Reminder
              </Button>

              <Button variant="danger">
                <Trash2 size={18} />
                Delete Bill
              </Button>
            </div>
          </section>

          {/* Back */}
          <div className="mt-10">
            <Link href="/bills">
              <Button variant="outline">
                ← Back to Bills
              </Button>
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}