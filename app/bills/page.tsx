import Navbar from "@/app/components/layout/Navbar";
import Sidebar from "@/app/components/layout/Sidebar";
import BillCard from "@/app/bills/BillCard";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import EmptyState from "@/app/components/ui/EmptyState";

import { Plus } from "lucide-react";
import Link from "next/link";

export default function BillsPage() {
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

      <div className="flex min-h-[calc(100vh-80px)] bg-slate-50">
        <Sidebar />

        <main className="flex-1 p-6 md:p-10">
          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold">
                Bills 💸
              </h1>

              <p className="mt-2 text-slate-500">
                Create and manage all your shared bills.
              </p>
            </div>

            <Link href="/bills/create">
              <Button>
                <Plus size={20} />
                Create Bill
              </Button>
            </Link>
          </div>

          {/* Search and Filters */}
          <section className="mt-10 flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <Input
                placeholder="Search bills..."
              />
            </div>

            <select className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none">
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
              <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
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
            )}
          </section>
        </main>
      </div>
    </>
  );
}