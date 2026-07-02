"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

type Bill = {
  id: string;
  title: string;
  total_amount: number;
  status: string;
};

export default function RecentBills() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentBills();
  }, []);

  const fetchRecentBills = async () => {
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
      .select("id,title,total_amount,status")
      .eq("owner_id", user.id)
      .order("created_at", {
        ascending: false,
      })
      .limit(5);

    if (error) {
      console.error(error);
    } else {
      setBills(data);
    }

    setLoading(false);
  };

  const statusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "text-green-600";

      case "active":
        return "text-blue-600";

      case "cancelled":
        return "text-red-600";

      default:
        return "text-orange-500";
    }
  };

  return (
    <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
      <h2 className="text-xl font-bold">
        Recent Bills
      </h2>

      {loading ? (
        <p className="mt-6 text-slate-500">
          Loading bills...
        </p>
      ) : bills.length === 0 ? (
        <p className="mt-6 text-slate-500">
          No bills created yet.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3">
                  Bill
                </th>

                <th className="pb-3">
                  Amount
                </th>

                <th className="pb-3">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {bills.map((bill) => (
                <tr
                  key={bill.id}
                  className="border-b last:border-b-0"
                >
                  <td className="py-4 font-medium">
                    {bill.title}
                  </td>

                  <td>
                    ₦
                    {Number(
                      bill.total_amount
                    ).toLocaleString()}
                  </td>

                  <td
                    className={statusColor(
                      bill.status
                    )}
                  >
                    {bill.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}