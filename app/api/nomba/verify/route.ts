import { NextRequest, NextResponse } from "next/server";
import { verifyNombaPayment } from "@/app/lib/verifyNombaPayment";
import { supabaseAdmin } from "@/app/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const { orderReference } = await req.json();

    if (!orderReference) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing orderReference",
        },
        {
          status: 400,
        }
      );
    }

    const result = await verifyNombaPayment(orderReference);

    console.log("Verification Result");
    console.dir(result, { depth: null });

    // If payment is successful, update the participant
    if (
      result.code === "00" &&
      result.data?.status === "SUCCESS"
    ) {
      const participantId =
        result.data.online_checkout_merchant_meta_participantId;

      // Check if participant has already been marked as paid
      console.log("Participant ID from Nomba:", participantId);
      const updateResult = await supabaseAdmin
        .from("bill_participants")
        .update({
          payment_status: "paid",
          payment_reference: result.data.orderReference,
        })
        .eq("id", participantId)
        .select();

      console.log("Update Result:", updateResult);
    }

    return NextResponse.json({
      success: result.code === "00" && result.data?.status === "SUCCESS",
      data: result.data,
      message: result.description,
    });


  } catch (error) {
    console.error("Verification Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Verification failed",
      },
      {
        status: 500,
      }
    );
  }
}