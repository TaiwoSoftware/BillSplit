import React from 'react'
import Button from "@/app/components/ui/Button";

import {
    Camera,
    Mail,
    Phone,
    MapPin,
    CalendarDays,
    Pencil,
    Receipt,
    Activity,
    Wallet,
    TrendingUp,
} from "lucide-react";
export default function AccountStatistics() {
    return (
        <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                        Account Statistics
                    </h2>

                    <p className="mt-1 text-slate-500">
                        Overview of your activity on BillSplit.
                    </p>
                </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {/* Total Bills */}
                <div
                    className="
            rounded-2xl
            border
            border-slate-200
            bg-slate-50
            p-6
            transition
            hover:-translate-y-1
            hover:shadow-lg
          "
                >
                    <div className="flex items-center justify-between">
                        <div
                            className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                bg-blue-100
              "
                        >
                            <Receipt className="text-blue-600" size={24} />
                        </div>

                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600">
                            +4
                        </span>
                    </div>

                    <h3 className="mt-6 text-4xl font-bold">
                        18
                    </h3>

                    <p className="mt-2 text-slate-500">
                        Bills Created
                    </p>
                </div>

                {/* Active Bills */}
                <div
                    className="
            rounded-2xl
            border
            border-slate-200
            bg-slate-50
            p-6
            transition
            hover:-translate-y-1
            hover:shadow-lg
          "
                >
                    <div className="flex items-center justify-between">
                        <div
                            className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                bg-emerald-100
              "
                        >
                            <Activity
                                className="text-emerald-600"
                                size={24}
                            />
                        </div>

                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600">
                            Active
                        </span>
                    </div>

                    <h3 className="mt-6 text-4xl font-bold">
                        7
                    </h3>

                    <p className="mt-2 text-slate-500">
                        Ongoing Bills
                    </p>
                </div>

                {/* Money Collected */}
                <div
                    className="
            rounded-2xl
            border
            border-slate-200
            bg-slate-50
            p-6
            transition
            hover:-translate-y-1
            hover:shadow-lg
          "
                >
                    <div className="flex items-center justify-between">
                        <div
                            className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                bg-yellow-100
              "
                        >
                            <Wallet
                                className="text-yellow-600"
                                size={24}
                            />
                        </div>

                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                            +₦25k
                        </span>
                    </div>

                    <h3 className="mt-6 text-3xl font-bold">
                        ₦350,000
                    </h3>

                    <p className="mt-2 text-slate-500">
                        Total Money Collected
                    </p>
                </div>

                {/* Success Rate */}
                <div
                    className="
            rounded-2xl
            border
            border-slate-200
            bg-slate-50
            p-6
            transition
            hover:-translate-y-1
            hover:shadow-lg
          "
                >
                    <div className="flex items-center justify-between">
                        <div
                            className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                bg-purple-100
              "
                        >
                            <TrendingUp
                                className="text-purple-600"
                                size={24}
                            />
                        </div>

                        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-600">
                            Excellent
                        </span>
                    </div>

                    <h3 className="mt-6 text-4xl font-bold">
                        96%
                    </h3>

                    <p className="mt-2 text-slate-500">
                        Collection Success
                    </p>
                </div>
            </div>

            {/* Bottom Analytics */}
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
                <div className="rounded-2xl bg-blue-50 p-6">
                    <p className="text-sm text-slate-500">
                        Total Participants
                    </p>

                    <h3 className="mt-2 text-3xl font-bold">
                        154
                    </h3>
                </div>

                <div className="rounded-2xl bg-green-50 p-6">
                    <p className="text-sm text-slate-500">
                        Completed Bills
                    </p>

                    <h3 className="mt-2 text-3xl font-bold">
                        11
                    </h3>
                </div>

                <div className="rounded-2xl bg-orange-50 p-6">
                    <p className="text-sm text-slate-500">
                        Pending Payments
                    </p>

                    <h3 className="mt-2 text-3xl font-bold">
                        9
                    </h3>
                </div>
            </div>
        </section>
    )
}
