"use server";

import { supabase } from "@/app/lib/supabase";
import { redirect } from "next/navigation";

export async function deleteBill(id: string) {
  // Delete participants first
  const { error: participantError } = await supabase
    .from("bill_participants")
    .delete()
    .eq("bill_id", id);

  if (participantError) {
    throw new Error(participantError.message);
  }

  // Delete bill
  const { error: billError } = await supabase
    .from("bills")
    .delete()
    .eq("id", id);

  if (billError) {
    throw new Error(billError.message);
  }

  redirect("/bills");
}