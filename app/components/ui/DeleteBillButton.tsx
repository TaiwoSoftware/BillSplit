"use client";

import { Trash2 } from "lucide-react";
import { deleteBill } from "@/app/actions/deleteBill";

export default function DeleteBillButton({
  billId,
}: {
  billId: string;
}) {
  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this bill?\n\nThis action cannot be undone."
    );

    if (!confirmed) return;

    try {
      await deleteBill(billId);
    } catch (error) {
      alert("Failed to delete bill.");
      console.error(error);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
    >
      <Trash2 size={18} />
      Delete Bill
    </button>
  );
}