import { supabase } from "@/app/lib/supabase";
import { getNombaToken } from "@/app/lib/nomba";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { billId, participantId } = await req.json();

    const { data: bill } = await supabase
      .from("bills")
      .select("*")
      .eq("id", billId)
      .single();

    const { data: participant } = await supabase
      .from("bill_participants")
      .select("*")
      .eq("id", participantId)
      .single();

    if (!bill || !participant) {
      return NextResponse.json(
        { error: "Bill or participant not found." },
        { status: 404 }
      );
    }

    const token = await getNombaToken();

    const response = await fetch(
      `${process.env.NOMBA_BASE_URL}/v1/checkout/order`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          accountId: process.env.NOMBA_ACCOUNT_ID!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order: {
            callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment-success`,
            customerEmail: participant.email,
            customerId: participant.id,
            amount: Number(participant.amount).toFixed(2),
            currency: "NGN",
            orderReference: crypto.randomUUID(),
            allowedPaymentMethods: ["Card", "Transfer"],
            orderMetaData: {
              billId,
              participantId,
              billTitle: bill.title,
            },
          },
          tokenizeCard: true,
        }),
      }
    );

    const result = await response.json();

    console.log("Nomba Response:");
    console.dir(result, { depth: null });

    if (!response.ok || result.code !== "00") {
      console.error(result);

      return NextResponse.json(result, {
        status: response.status,
      });
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error: "Unable to create checkout.",
      },
      {
        status: 500,
      }
    );
  }
}