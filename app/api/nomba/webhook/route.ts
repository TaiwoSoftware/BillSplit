import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import { verifyNombaPayment } from "@/app/lib/verifyNombaPayment";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("Webhook Received");
    console.dir(body, { depth: null });

    const participantId =
      body.orderMetaData?.participantId;

    const billId =
      body.orderMetaData?.billId;

    const orderReference =
      body.orderReference;

    if (!participantId || !billId || !orderReference) {
      return NextResponse.json(
        {
          error: "Invalid webhook payload",
        },
        {
          status: 400,
        }
      );
    }

    // STEP 2
    const verification =
      await verifyNombaPayment(orderReference);

    if (
      verification.code !== "00" ||
      verification.data?.status !== "SUCCESS"
    ) {
      return NextResponse.json(
        {
          error: "Payment not verified",
        },
        {
          status: 400,
        }
      );
    }

    // STEP 3–6
    const { error } = await supabase
      .from("bill_participants")
      .update({
        payment_status: "paid",
        payment_reference: orderReference,
        paid_at: new Date().toISOString(),
      })
      .eq("id", participantId);

    if (error) throw error;

    // STEP 7

    const { data: participants } = await supabase
      .from("bill_participants")
      .select("payment_status")
      .eq("bill_id", billId);

    const everyonePaid =
      participants?.every(
        (p) => p.payment_status === "paid"
      );

    // STEP 8

    if (everyonePaid) {
      await supabase
        .from("bills")
        .update({
          status: "completed",
        })
        .eq("id", billId);
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Webhook failed",
      },
      {
        status: 500,
      }
    );
  }
}