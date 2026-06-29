"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/app/components/layout/Navbar";
import Sidebar from "@/app/components/layout/Sidebar";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import {
  Calendar,
  Plus,
  CreditCard,
  Landmark,
  Menu,
  X,
  Copy,
  Check,
  Share2,
  ExternalLink,
} from "lucide-react";

export default function CreateBillPage() {
  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [splitType, setSplitType] =
    useState("equal");

  const [participants, setParticipants] =
    useState([
      {
        id: crypto.randomUUID(),
        name: "",
        email: "",
      },
    ]);

  const [errors, setErrors] = useState<
    Record<string, string>
  >({});

  const [paymentMethods, setPaymentMethods] =
    useState({
      card: true,
      bank: true,
    });

  const addParticipant = () => {
    setParticipants((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "",
        email: "",
      },
    ]);
  };
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [billLink, setBillLink] = useState("");

  const [billId, setBillId] = useState("");

  const [copied, setCopied] = useState(false);

  const updateParticipant = (
    id: string,
    field: "name" | "email",
    value: string
  ) => {
    setParticipants((prev) =>
      prev.map((participant) =>
        participant.id === id
          ? {
            ...participant,
            [field]: value,
          }
          : participant
      )
    );
  };

  const validate = () => {
    const newErrors: Record<
      string,
      string
    > = {};

    if (!title.trim()) {
      newErrors.title =
        "Bill title is required";
    }

    if (!description.trim()) {
      newErrors.description =
        "Description is required";
    }

    if (!amount.trim()) {
      newErrors.amount =
        "Target amount is required";
    }

    if (!dueDate) {
      newErrors.dueDate =
        "Due date is required";
    }

    participants.forEach(
      (participant, index) => {
        if (!participant.name.trim()) {
          newErrors[
            `name-${index}`
          ] = "Name is required";
        }

        if (!participant.email.trim()) {
          newErrors[
            `email-${index}`
          ] = "Email is required";
        }
      }
    );

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const id =
      "BILL-" +
      Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

    const payload = {
      id,
      title,
      description,
      amount,
      dueDate,
      splitType,
      paymentMethods,
      participants,
    };

    console.log(payload);

    setBillId(id);

    const link =
      `${window.location.origin}/pay/${id}`;

    setBillLink(link);

    setShowSuccessModal(true);
  };
  const copyLink = async () => {
    await navigator.clipboard.writeText(
      billLink
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  const shareLink = async () => {
    if (navigator.share) {
      await navigator.share({
        title,
        text: `Contribute to ${title}`,
        url: billLink,
      });
    } else {
      copyLink();
    }
  };

  const completedFields = [
    title,
    description,
    amount,
    dueDate,
  ].filter(Boolean).length;

  const progress = Math.round(
    (completedFields / 4) * 100
  );

  return (
    <>
      <Navbar />

      <div className="relative flex min-h-[calc(100vh-80px)] bg-slate-50">
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

        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() =>
            setIsSidebarOpen(false)
          }
        />

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
                lg:hidden
              "
            >
              {isSidebarOpen ? (
                <X size={22} />
              ) : (
                <Menu size={22} />
              )}
            </button>

            <div className="flex-1">
              <h1 className="text-3xl font-bold md:text-4xl">
                Create Bill 💸
              </h1>

              <p className="mt-2 text-slate-500">
                Set up a bill and start
                collecting contributions.
              </p>

              {/* Progress */}
              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">
                    Progress
                  </span>

                  <span className="text-sm font-semibold text-blue-600">
                    {progress}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-300"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="mt-10 space-y-8">
            {/* Bill Information */}
            <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-xl font-bold">
                Bill Information
              </h2>

              <div className="mt-6 space-y-5">
                <div>
                  <Input
                    label="Bill Title"
                    placeholder="Birthday Dinner"
                    value={title}
                    onChange={(e) =>
                      setTitle(
                        e.target.value
                      )
                    }
                  />

                  {errors.title && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.title}
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    label="Description"
                    placeholder="Contributions for dinner"
                    value={description}
                    onChange={(e) =>
                      setDescription(
                        e.target.value
                      )
                    }
                  />

                  {errors.description && (
                    <p className="mt-1 text-sm text-red-500">
                      {
                        errors.description
                      }
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    label="Target Amount"
                    type="number"
                    placeholder="30000"
                    value={amount}
                    onChange={(e) =>
                      setAmount(
                        e.target.value
                      )
                    }
                  />

                  {errors.amount && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.amount}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block font-medium">
                    Due Date
                  </label>

                  <div className="relative">
                    <Calendar
                      size={20}
                      className="
                        absolute left-4 top-1/2
                        -translate-y-1/2
                        text-slate-400
                      "
                    />

                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) =>
                        setDueDate(
                          e.target.value
                        )
                      }
                      className="
                        w-full rounded-xl
                        border border-slate-300
                        py-3 pl-12 pr-4
                        outline-none
                        focus:border-blue-600
                      "
                    />
                  </div>

                  {errors.dueDate && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.dueDate}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Contribution Type */}
            <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-xl font-bold">
                Contribution Type
              </h2>

              <div className="mt-6 space-y-4">
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    checked={
                      splitType ===
                      "equal"
                    }
                    onChange={() =>
                      setSplitType(
                        "equal"
                      )
                    }
                  />
                  <span>
                    Equal Split
                  </span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    checked={
                      splitType ===
                      "custom"
                    }
                    onChange={() =>
                      setSplitType(
                        "custom"
                      )
                    }
                  />
                  <span>
                    Custom Split
                  </span>
                </label>
              </div>
            </section>

            {/* Participants */}
            <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  Participants
                </h2>

                <Button
                  type="button"
                  onClick={
                    addParticipant
                  }
                >
                  <Plus size={18} />
                  Add
                </Button>
              </div>

              <div className="mt-6 space-y-5">
                {participants.map(
                  (
                    participant,
                    index
                  ) => (
                    <div
                      key={
                        participant.id
                      }
                      className="space-y-4"
                    >
                      <Input
                        placeholder="Name"
                        value={
                          participant.name
                        }
                        onChange={(e) =>
                          updateParticipant(
                            participant.id,
                            "name",
                            e.target.value
                          )
                        }
                      />

                      {errors[
                        `name-${index}`
                      ] && (
                          <p className="text-sm text-red-500">
                            {
                              errors[
                              `name-${index}`
                              ]
                            }
                          </p>
                        )}

                      <Input
                        placeholder="Email"
                        value={
                          participant.email
                        }
                        onChange={(e) =>
                          updateParticipant(
                            participant.id,
                            "email",
                            e.target.value
                          )
                        }
                      />

                      {errors[
                        `email-${index}`
                      ] && (
                          <p className="text-sm text-red-500">
                            {
                              errors[
                              `email-${index}`
                              ]
                            }
                          </p>
                        )}
                    </div>
                  )
                )}
              </div>
            </section>

            {/* Payment Methods */}
            <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-xl font-bold">
                Payment Methods
              </h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <label className="flex cursor-pointer items-center gap-4 rounded-2xl border p-6">
                  <input
                    type="checkbox"
                    checked={
                      paymentMethods.card
                    }
                    onChange={() =>
                      setPaymentMethods(
                        (
                          prev
                        ) => ({
                          ...prev,
                          card:
                            !prev.card,
                        })
                      )
                    }
                  />

                  <CreditCard />
                  <span>
                    Card Payments
                  </span>
                </label>

                <label className="flex cursor-pointer items-center gap-4 rounded-2xl border p-6">
                  <input
                    type="checkbox"
                    checked={
                      paymentMethods.bank
                    }
                    onChange={() =>
                      setPaymentMethods(
                        (
                          prev
                        ) => ({
                          ...prev,
                          bank:
                            !prev.bank,
                        })
                      )
                    }
                  />

                  <Landmark />
                  <span>
                    Bank Transfer
                  </span>
                </label>
              </div>
            </section>

            {/* Actions */}
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
              <Link href="/bills">
                <Button variant="outline">
                  Cancel
                </Button>
              </Link>

              <Button
                onClick={
                  handleSubmit
                }
              >
                Create Bill
              </Button>
            </div>
          </div>
          {
            showSuccessModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5">
                <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl">

                  <div className="text-center">

                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">

                      <Check
                        size={42}
                        className="text-green-600"
                      />

                    </div>

                    <h2 className="mt-6 text-3xl font-bold">
                      Bill Created 🎉
                    </h2>

                    <p className="mt-3 text-slate-500">
                      Your bill has been created successfully.
                    </p>

                  </div>

                  <div className="mt-8 space-y-4 rounded-2xl bg-slate-50 p-6">

                    <div className="flex justify-between">
                      <span className="text-slate-500">
                        Bill
                      </span>

                      <span className="font-semibold">
                        {title}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">
                        Bill ID
                      </span>

                      <span className="font-semibold">
                        {billId}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">
                        Amount
                      </span>

                      <span className="font-semibold">
                        ₦{amount}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">
                        Participants
                      </span>

                      <span className="font-semibold">
                        {participants.length}
                      </span>
                    </div>

                  </div>

                  <div className="mt-8">

                    <label className="mb-2 block font-semibold">
                      Share Link
                    </label>

                    <div className="flex overflow-hidden rounded-xl border">

                      <input
                        readOnly
                        value={billLink}
                        className="flex-1 px-4 py-3 outline-none"
                      />

                      <button
                        onClick={copyLink}
                        className="bg-blue-600 px-5 text-white hover:bg-blue-700"
                      >
                        {copied ? (
                          <Check size={18} />
                        ) : (
                          <Copy size={18} />
                        )}
                      </button>

                    </div>

                  </div>

                  <div className="mt-8 grid gap-3">

                    <Button
                      onClick={shareLink}
                    >
                      <Share2 size={18} />
                      Share Link
                    </Button>

                    <Link href={`/bills/${billId}`}>
                      <Button variant="outline" className="w-full">
                        <ExternalLink size={18} />
                        View Bill
                      </Button>
                    </Link>

                    <Button
                      variant="outline"
                      onClick={() => setShowSuccessModal(false)}
                    >
                      Close
                    </Button>

                  </div>

                </div>
              </div>
            )
          }
        </main>
      </div>
    </>
  );
}