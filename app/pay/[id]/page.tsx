import { supabase } from "@/app/lib/supabase";
import {
    Calendar,
    Wallet,
    Users,
    BadgeCheck,
    ArrowRight,
} from "lucide-react";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function PayPage({
    params,
}: Props) {
    const { id } = await params;

    // Fetch bill with participants in a single query
    const { data: bill, error } = await supabase
        .from("bills")
        .select(`
            *,
            bill_participants (*)
        `)
        .eq("id", id)
        .single();

    if (error || !bill) {
        console.error("Error fetching bill:", error);
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100">
                <div className="rounded-3xl bg-white p-10 shadow-lg">
                    <h1 className="text-3xl font-bold text-red-500">
                        Bill not found
                    </h1>
                    <p className="mt-3 text-slate-500">
                        This payment link may have expired or does not exist.
                    </p>
                </div>
            </div>
        );
    }

    // Extract participants from the bill data
    const participants = bill.bill_participants || [];

    const dueDate = new Date(
        bill.due_date
    ).toLocaleDateString("en-NG", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 py-10 px-5">
            <div className="mx-auto max-w-3xl">

                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                        🎉
                    </div>

                    <h1 className="mt-5 text-4xl font-bold">
                        {bill.title}
                    </h1>

                    <p className="mt-3 text-lg text-slate-500">
                        {bill.description}
                    </p>
                </div>

                {/* Card */}
                <div className="rounded-3xl bg-white p-8 shadow-lg">

                    <h2 className="mb-6 text-xl font-bold">
                        Bill Details
                    </h2>

                    <div className="grid gap-5 md:grid-cols-2">

                        <div className="rounded-2xl bg-slate-50 p-5">
                            <Wallet
                                className="mb-3 text-blue-600"
                                size={26}
                            />

                            <p className="text-sm text-slate-500">
                                Total Amount
                            </p>

                            <h3 className="mt-2 text-3xl font-bold">
                                ₦
                                {Number(
                                    bill.total_amount
                                ).toLocaleString()}
                            </h3>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-5">
                            <Users
                                className="mb-3 text-blue-600"
                                size={26}
                            />

                            <p className="text-sm text-slate-500">
                                Participants
                            </p>

                            <h3 className="mt-2 text-3xl font-bold">
                                {participants.length}
                            </h3>

                            <p className="mt-2 text-sm capitalize text-slate-500">
                                {bill.split_type} split
                            </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-5">
                            <Calendar
                                className="mb-3 text-blue-600"
                                size={26}
                            />

                            <p className="text-sm text-slate-500">
                                Due Date
                            </p>

                            <h3 className="mt-2 text-lg font-semibold">
                                {dueDate}
                            </h3>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-5">
                            <BadgeCheck
                                className="mb-3 text-green-600"
                                size={26}
                            />

                            <p className="text-sm text-slate-500">
                                Status
                            </p>

                            <span className="mt-2 inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                                {bill.status}
                            </span>
                        </div>

                    </div>

                    <div className="mt-10 rounded-2xl bg-white border p-6">
                        <h2 className="mb-5 text-xl font-bold">
                            Participants
                        </h2>

                        <div className="space-y-4">
                            {participants.length > 0 ? (
                                <div className="space-y-4">
                                    {participants.map((participant: { id: string; name: string; email: string; amount: string; status: string }) => (
                                        <div
                                            key={participant.id}
                                            className="flex items-center justify-between rounded-xl border p-4"
                                        >
                                            <div>
                                                <h3 className="font-semibold">
                                                    {participant.name}
                                                </h3>

                                                <p className="text-sm text-slate-500">
                                                    {participant.email}
                                                </p>
                                            </div>

                                            <div className="text-right">
                                                <p className="font-semibold">
                                                    ₦{Number(participant.amount).toLocaleString()}
                                                </p>

                                                <span
                                                    className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${participant.status === "paid"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                        }`}
                                                >
                                                    {participant.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-500">
                                    No participants have been added.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="mt-10 rounded-2xl bg-blue-50 p-6">
                        <h3 className="font-bold">
                            Payment Method
                        </h3>

                        <p className="mt-2 text-slate-600">
                            Bank Transfer via Nomba
                        </p>
                    </div>

                    {/* Button */}
                    <button
                        className="
                            mt-10
                            flex
                            w-full
                            items-center
                            justify-center
                            gap-3
                            rounded-2xl
                            bg-blue-600
                            px-6
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

                    <p className="mt-5 text-center text-sm text-slate-500">
                        Your payment is processed securely through
                        Nomba.
                    </p>

                </div>
            </div>
        </div>
    );
}