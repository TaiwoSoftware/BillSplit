import { supabase } from "@/app/lib/supabase";
import {
    Calendar,
    Wallet,
    Users,
    BadgeCheck,
    ArrowRight,
    Mail,
    User,
} from "lucide-react";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function Page({
    params,
}: Props) {
    const { id } = await params;

    // Fetch bill
    const { data: bill, error } = await supabase
        .from("bills")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error || !bill) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100">
                <div className="rounded-3xl bg-white p-10 shadow-lg text-center">
                    <h1 className="text-3xl font-bold text-red-500">
                        Bill not found
                    </h1>

                    <p className="mt-3 text-slate-500">
                        This bill does not exist or may have been removed.
                    </p>
                </div>
            </div>
        );
    }

    // Fetch participants
    const {
        data: participants,
        error: participantError,
    } = await supabase
        .from("bill_participants")
        .select("*")
        .eq("bill_id", id);
console.log("Participants:", participants);
console.log("Count:", participants?.length);
    const participantCount = participants?.length ?? 0;

    const dueDate = new Date(
        bill.due_date
    ).toLocaleDateString("en-NG", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    const totalAmount = Number(bill.total_amount);

    const paidAmount =
        participants
            ?.filter((p) => p.payment_status === "paid")
            .reduce(
                (sum, p) => sum + Number(p.amount ?? 0),
                0
            ) ?? 0;

    const progress =
        totalAmount === 0
            ? 0
            : Math.round((paidAmount / totalAmount) * 100);

    return (
        <div className="min-h-screen bg-slate-100 py-10 px-5">

            <div className="mx-auto max-w-5xl">

                {/* Header */}

                <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-10 text-white shadow-xl">

                    <h1 className="text-4xl font-bold">
                        {bill.title}
                    </h1>

                    <p className="mt-3 text-blue-100">
                        {bill.description}
                    </p>

                    <div className="mt-8 grid gap-6 md:grid-cols-4">

                        <div>
                            <p className="text-sm text-blue-100">
                                Total Amount
                            </p>

                            <h2 className="mt-2 text-3xl font-bold">
                                ₦{totalAmount.toLocaleString()}
                            </h2>
                        </div>

                        <div>
                            <p className="text-sm text-blue-100">
                                Participants
                            </p>

                            <h2 className="mt-2 text-3xl font-bold">
                                {participantCount}
                            </h2>
                        </div>

                        <div>
                            <p className="text-sm text-blue-100">
                                Due Date
                            </p>

                            <h2 className="mt-2 font-semibold">
                                {dueDate}
                            </h2>
                        </div>

                        <div>
                            <p className="text-sm text-blue-100">
                                Status
                            </p>

                            <span className="mt-3 inline-flex rounded-full bg-white/20 px-4 py-2 text-sm">
                                {bill.status}
                            </span>
                        </div>

                    </div>

                </div>

                {/* Progress */}

                <div className="mt-8 rounded-3xl bg-white p-8 shadow">

                    <div className="flex items-center justify-between">

                        <h2 className="text-xl font-bold">
                            Contribution Progress
                        </h2>

                        <span className="font-semibold">
                            {progress}%
                        </span>

                    </div>

                    <div className="mt-5 h-4 overflow-hidden rounded-full bg-slate-200">

                        <div
                            className="h-full rounded-full bg-green-500 transition-all"
                            style={{
                                width: `${progress}%`,
                            }}
                        />

                    </div>

                    <div className="mt-4 flex justify-between text-sm text-slate-500">

                        <span>
                            ₦{paidAmount.toLocaleString()} collected
                        </span>

                        <span>
                            ₦{totalAmount.toLocaleString()} target
                        </span>

                    </div>

                </div>

                {/* Participants */}

                <div className="mt-8 rounded-3xl bg-white p-8 shadow">

                    <div className="mb-6 flex items-center gap-3">

                        <Users className="text-blue-600" />

                        <h2 className="text-2xl font-bold">
                            Participants ({participantCount})
                        </h2>

                    </div>

                    <div className="space-y-4">

                        {(participants ?? []).map((participant) => (

                            <div
                                key={participant.id}
                                className="flex flex-col gap-5 rounded-2xl border p-5 md:flex-row md:items-center md:justify-between"
                            >

                                <div>

                                    <div className="flex items-center gap-2">

                                        <User size={18} />

                                        <h3 className="font-semibold">
                                            {participant.name}
                                        </h3>

                                    </div>

                                    <div className="mt-2 flex items-center gap-2 text-slate-500">

                                        <Mail size={16} />

                                        {participant.email}

                                    </div>

                                </div>

                                <div className="text-right">

                                    <p className="text-xl font-bold">

                                        ₦
                                        {Number(
                                            participant.amount
                                        ).toLocaleString()}

                                    </p>

                                    <span
                                        className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${participant.payment_status === "paid"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                            }`}
                                    >
                                        {participant.payment_status ?? "Pending"}
                                    </span>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

                {/* Payment */}

                <div className="mt-8 rounded-3xl bg-white p-8 shadow">

                    <div className="flex items-center gap-3">

                        <Wallet className="text-blue-600" />

                        <h2 className="text-xl font-bold">
                            Ready to Pay?
                        </h2>

                    </div>

                    <p className="mt-3 text-slate-500">
                        Click below to securely complete your contribution through Nomba.
                    </p>

                    <button
                        className="
              mt-8
              flex
              w-full
              items-center
              justify-center
              gap-3
              rounded-2xl
              bg-blue-600
              py-5
              text-lg
              font-semibold
              text-white
              transition
              hover:bg-blue-700
            "
                    >
                        Pay with Nomba

                        <ArrowRight size={22} />
                    </button>

                </div>

            </div>

        </div>
    );
}