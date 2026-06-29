"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function BillDetailsPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Bill state with participants
  const [bill, setBill] = useState({
    id: "1",
    title: "Birthday Dinner 🎉",
    description: "Contributions for dinner at Chicken Republic.",
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
  });

  // Set mounted state to handle hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const progress = Math.min((bill.collected / bill.target) * 100, 100);

  // Notification helper
  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Copy link functionality
  const copyLink = async () => {
    try {
      const link = `https://billsplit.com/bills/${bill.id}`;
      await navigator.clipboard.writeText(link);
      showNotification("Bill link copied to clipboard!", "success");
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = `https://billsplit.com/bills/${bill.id}`;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        showNotification("Bill link copied to clipboard!", "success");
      } catch (err) {
        showNotification("Failed to copy link. Please copy manually.", "error");
      }
      document.body.removeChild(textArea);
    }
  };

  // Edit bill functionality
  const handleEditBill = () => {
    router.push(`/bills/${bill.id}/edit`);
  };

  // Send reminder functionality
  const handleSendReminder = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const unpaidParticipants = bill.participants.filter((p) => !p.paid);
      if (unpaidParticipants.length === 0) {
        showNotification("All participants have paid!", "success");
        return;
      }

      const emailList = unpaidParticipants.map((p) => p.email).join(", ");
      showNotification(
        `Reminders sent to: ${emailList}`,
        "success"
      );
    } catch (error) {
      showNotification("Failed to send reminders. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [bill.participants]);

  // Delete bill functionality
  const handleDeleteBill = useCallback(async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${bill.title}"? This action cannot be undone.`
    );
    
    if (!confirmDelete) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      showNotification(`Bill "${bill.title}" deleted successfully!`, "success");
      
      // Navigate back to bills list after a brief delay
      setTimeout(() => {
        router.push("/bills");
      }, 1500);
    } catch (error) {
      showNotification("Failed to delete bill. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [bill.title, router]);

  // Update participant payment status
  const togglePaymentStatus = useCallback((participantId: string) => {
    setBill((prevBill) => {
      const updatedParticipants = prevBill.participants.map((p) =>
        p.id === participantId ? { ...p, paid: !p.paid } : p
      );

      // Recalculate collected amount
      const newCollected = updatedParticipants
        .filter((p) => p.paid)
        .reduce((sum, p) => sum + p.amount, 0);

      return {
        ...prevBill,
        participants: updatedParticipants,
        collected: newCollected,
        status: newCollected === prevBill.target ? "Completed" : "Active",
      };
    });
  }, []);

  // Share via native share API
  const handleShareViaNative = useCallback(async () => {
    const shareData = {
      title: bill.title,
      text: `Join me in contributing to ${bill.title}!`,
      url: `https://billsplit.com/bills/${bill.id}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        showNotification("Shared successfully!", "success");
      } else {
        // Fallback - just copy the link
        await copyLink();
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        showNotification("Failed to share. Please try again.", "error");
      }
    }
  }, [bill.title]);

  // Check if native share is available (only on client side)
  const hasNativeShare = isMounted && typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <>
      <Navbar />

      <div className="relative flex min-h-[calc(100vh-80px)] bg-slate-50">
        {/* Notification Toast */}
        {notification && (
          <div
            className={`
              fixed top-20 right-4 z-50
              flex items-center gap-3
              rounded-2xl px-6 py-4
              shadow-lg transition-all duration-300
              ${
                notification.type === "success"
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-red-100 text-red-700 border border-red-300"
              }
            `}
            role="alert"
          >
            {notification.type === "success" ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        )}

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          />
        )}

        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Main */}
        <main className="flex-1 overflow-x-hidden p-5 md:p-8 lg:p-10">
          {/* Header */}
          <div className="flex items-start gap-4">
            <button
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="
                rounded-xl border border-slate-200
                bg-white p-3 shadow-sm
                transition hover:bg-slate-100
                lg:hidden
              "
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <div className="flex-1">
              <h1 className="text-3xl font-bold md:text-4xl">{bill.title}</h1>
              <p className="mt-2 text-slate-500">{bill.description}</p>
            </div>
          </div>

          {/* Status */}
          <div className="mt-8 flex flex-wrap gap-4">
            <div
              className={`
                rounded-xl px-4 py-2 text-sm font-medium
                ${
                  bill.status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }
              `}
            >
              {bill.status}
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 shadow-sm">
              <Calendar size={18} />
              <span>{bill.createdAt}</span>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 shadow-sm">
              <Clock size={18} />
              <span>Due: {bill.dueDate}</span>
            </div>
          </div>

          {/* Progress */}
          <section className="mt-10 rounded-3xl bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Contribution Progress</h2>
              <span className="font-semibold text-blue-600">
                {progress.toFixed(0)}%
              </span>
            </div>

            <div className="mt-6 h-4 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-6 flex justify-between">
              <div>
                <p className="text-sm text-slate-500">Collected</p>
                <p className="text-2xl font-bold">
                  ₦{bill.collected.toLocaleString()}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-slate-500">Target</p>
                <p className="text-2xl font-bold">
                  ₦{bill.target.toLocaleString()}
                </p>
              </div>
            </div>
          </section>

          {/* Participants */}
          <section className="mt-10 rounded-3xl bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users />
                <h2 className="text-xl font-bold">Participants</h2>
              </div>
              <span className="text-sm text-slate-500">
                {bill.participants.filter((p) => p.paid).length}/
                {bill.participants.length} paid
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {bill.participants.map((participant) => (
                <div
                  key={participant.id}
                  className="
                    flex flex-col gap-4
                    rounded-2xl border p-5
                    md:flex-row md:items-center md:justify-between
                    hover:bg-slate-50 transition
                  "
                >
                  <div>
                    <h3 className="font-semibold">{participant.name}</h3>
                    <p className="text-sm text-slate-500">{participant.email}</p>
                  </div>

                  <div className="flex items-center justify-between md:gap-6">
                    <div className="text-left">
                      <p className="font-semibold">
                        ₦{participant.amount.toLocaleString()}
                      </p>
                      <span
                        className={`text-sm ${
                          participant.paid ? "text-green-600" : "text-orange-500"
                        }`}
                      >
                        {participant.paid ? "✅ Paid" : "⏳ Pending"}
                      </span>
                    </div>

                    <button
                      onClick={() => togglePaymentStatus(participant.id)}
                      className={`
                        ml-4 rounded-lg px-4 py-2 text-sm font-medium
                        transition hover:opacity-80
                        ${
                          participant.paid
                            ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        }
                      `}
                      aria-label={`Toggle payment status for ${participant.name}`}
                    >
                      {participant.paid ? "Mark Unpaid" : "Mark Paid"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Breakdown */}
          <section className="mt-10 rounded-3xl bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-xl font-bold">Contribution Breakdown</h2>

            <div className="mt-6">
              <p className="text-slate-500">{bill.splitType}</p>
              <p className="mt-2 text-3xl font-bold">
                ₦
                {Math.floor(
                  bill.target / bill.participants.length
                ).toLocaleString()}
              </p>
              <p className="mt-2 text-slate-500">Per participant</p>
            </div>
          </section>

          {/* Payment Methods */}
          <section className="mt-10 rounded-3xl bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-xl font-bold">Payment Methods</h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="flex items-center gap-4 rounded-2xl border p-6 hover:bg-slate-50 transition cursor-pointer">
                <CreditCard className="text-blue-600" />
                <span className="font-medium">Card Payments</span>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border p-6 hover:bg-slate-50 transition cursor-pointer">
                <Landmark className="text-blue-600" />
                <span className="font-medium">Bank Transfer</span>
              </div>
            </div>
          </section>

          {/* Share */}
          <section className="mt-10 rounded-3xl bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-xl font-bold">Share Bill</h2>

            <div className="mt-6 flex flex-col gap-4 md:flex-row">
              <input
                readOnly
                value={`https://billsplit.com/bills/${bill.id}`}
                className="
                  flex-1 rounded-xl border border-slate-300
                  bg-slate-50 px-4 py-3
                  outline-none cursor-text
                "
              />

              <Button onClick={copyLink}>
                <Share2 size={18} />
                Copy Link
              </Button>

              {isMounted && hasNativeShare && (
                <Button variant="outline" onClick={handleShareViaNative}>
                  <Share2 size={18} />
                  Share
                </Button>
              )}
            </div>
          </section>

          {/* Actions */}
          <section className="mt-10 rounded-3xl bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-xl font-bold">Actions</h2>

            <div className="mt-6 flex flex-col gap-4 md:flex-row">
              <Button onClick={handleEditBill} disabled={isLoading}>
                <Pencil size={18} />
                Edit Bill
              </Button>

              <Button variant="outline" onClick={handleSendReminder} disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Reminder"}
              </Button>

              <Button variant="danger" onClick={handleDeleteBill} disabled={isLoading}>
                <Trash2 size={18} />
                {isLoading ? "Deleting..." : "Delete Bill"}
              </Button>
            </div>
          </section>

          {/* Back */}
          <div className="mt-10">
            <Link href="/bills">
              <Button variant="outline">← Back to Bills</Button>
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}