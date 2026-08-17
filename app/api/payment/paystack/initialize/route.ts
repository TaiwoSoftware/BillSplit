import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabase-admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { billId, participantId } = body;

    // ---------------------------------------------
    // 1. Validate request
    // ---------------------------------------------

    if (!billId || !participantId) {
      return NextResponse.json(
        {
          error:
            "Bill ID and participant ID are required.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------
    // 2. Get participant
    // ---------------------------------------------

    const { data: participant, error: participantError } =
      await supabaseAdmin
        .from("bill_participants")
        .select("*")
        .eq("id", participantId)
        .eq("bill_id", billId)
        .maybeSingle();

    if (participantError) {
      console.error(
        "Participant fetch error:",
        participantError
      );

      return NextResponse.json(
        {
          error: "Unable to retrieve participant.",
        },
        { status: 500 }
      );
    }

    if (!participant) {
      return NextResponse.json(
        {
          error: "Participant not found.",
        },
        { status: 404 }
      );
    }

    // ---------------------------------------------
    // 3. Check payment status
    // ---------------------------------------------

    if (participant.payment_status === "paid") {
      return NextResponse.json(
        {
          error:
            "This contribution has already been paid.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------
    // 4. Get participant information
    // ---------------------------------------------

    const email =
      participant.email?.trim().toLowerCase();

    const amount = Number(participant.amount);

    if (!email) {
      return NextResponse.json(
        {
          error:
            "Participant email is missing.",
        },
        { status: 400 }
      );
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        {
          error:
            "Invalid participant payment amount.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------
    // 5. Convert Naira to Kobo
    // ---------------------------------------------

    const amountInKobo = Math.round(amount * 100);

    // ---------------------------------------------
    // 6. Generate unique Paystack reference
    // ---------------------------------------------

    const reference =
      `BILLSPLIT-${billId}-${participantId}-${Date.now()}`;

    // ---------------------------------------------
    // 7. Callback URL
    // ---------------------------------------------

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const callbackUrl =
      `${appUrl}/pay/payment-success`;

    // ---------------------------------------------
    // 8. Make sure Paystack secret exists
    // ---------------------------------------------

    const paystackSecret =
      process.env.PAYSTACK_SECRET_KEY;

    if (!paystackSecret) {
      console.error(
        "PAYSTACK_SECRET_KEY is missing."
      );

      return NextResponse.json(
        {
          error:
            "Paystack is not configured correctly.",
        },
        { status: 500 }
      );
    }

    // ---------------------------------------------
    // 9. Initialize Paystack
    // ---------------------------------------------

    const paystackResponse = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${paystackSecret}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          amount: String(amountInKobo),
          currency: "NGN",
          reference,
          callback_url: callbackUrl,

          metadata: {
            bill_id: billId,
            participant_id: participantId,
            participant_name: participant.name,
            email,
          },
        }),
      }
    );

    const paystackData =
      await paystackResponse.json();

    // ---------------------------------------------
    // 10. Handle Paystack error
    // ---------------------------------------------

    if (
      !paystackResponse.ok ||
      !paystackData.status
    ) {
      console.error(
        "Paystack initialization error:",
        paystackData
      );

      return NextResponse.json(
        {
          error:
            paystackData.message ||
            "Unable to initialize Paystack payment.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------
    // 11. Extract Paystack data
    // ---------------------------------------------

    const authorizationUrl =
      paystackData.data?.authorization_url;

    const accessCode =
      paystackData.data?.access_code;

    const paystackReference =
      paystackData.data?.reference;

    if (
      !authorizationUrl ||
      !paystackReference
    ) {
      console.error(
        "Incomplete Paystack response:",
        paystackData
      );

      return NextResponse.json(
        {
          error:
            "Paystack did not return a valid checkout URL.",
        },
        { status: 500 }
      );
    }

    // ---------------------------------------------
    // 12. Save payment in Supabase
    // ---------------------------------------------

    const { error: paymentError } =
      await supabaseAdmin
        .from("payments")
        .insert({
          transaction_id: paystackReference,

          bill_id: billId,

          participant_id: participantId,

          amount: amount,

          reference: paystackReference,

          sender_name: participant.name,

          status: "pending",

          raw_payload: paystackData,
        });

    if (paymentError) {
      console.error(
        "Payment database error:",
        paymentError
      );

      return NextResponse.json(
        {
          error:
            "Payment was initialized, but we could not save the payment record.",
        },
        { status: 500 }
      );
    }

    // ---------------------------------------------
    // 13. Return checkout information
    // ---------------------------------------------

    return NextResponse.json({
      success: true,

      checkoutUrl: authorizationUrl,

      accessCode,

      reference: paystackReference,
    });
  } catch (error) {
    console.error(
      "Paystack initialization error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while initializing payment.",
      },
      { status: 500 }
    );
  }
}