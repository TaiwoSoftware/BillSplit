"use client";

import { useState } from "react";
import Link from "next/link";

import Navbar from "@/app/components/layout/Navbar";
import Sidebar from "@/app/components/layout/Sidebar";
import BillCard from "@/app/bills/BillCard";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import EmptyState from "@/app/components/ui/EmptyState";

import {
  Plus,
  Menu,
  X,
} from "lucide-react";

export default function BillsPage() {
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
    {
      id: "3",
      title: "Faculty Excursion",
      collected: 40000,
      target: 50000,
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
            <div className="flex items-start gap-4">
              {/* Mobile Hamburger */}
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
                  Bills 💸
                </h1>

                <p className="mt-2 text-sm text-slate-500 md:text-base">
                  Create and manage all your shared
                  bills.
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

          {/* Search & Filter */}
          <section className="mt-10 flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <Input
                placeholder="Search bills..."
              />
            </div>

            <select
              className="
                rounded-xl
                border
                border-slate-300
                bg-white
                px-4
                py-3
                outline-none
                md:w-52
              "
            >
              <option>All Bills</option>
              <option>Active</option>
              <option>Completed</option>
              <option>Pending</option>
            </select>
          </section>

          {/* Bills Grid */}
          <section className="mt-10">
            {bills.length === 0 ? (
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
                    collected={
                      bill.collected
                    }
                    target={bill.target}
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