import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/app/lib/supabase-admin";

export async function POST(request: NextRequest) {
  try {
    const { billId, participantId, otp } = await request.json();

    if (!billId || !participantId || !otp) {
      return NextResponse.json(
        {
          error: "Bill ID, participant ID and OTP are required.",
        },
        { status: 400 }
      );
    }

    // Make sure OTP is a 6-digit code
    if (!/^\d{6}$/.test(String(otp))) {
      return NextResponse.json(
        {
          error: "Verification code must be 6 digits.",
        },
        { status: 400 }
      );
    }

    // Get the latest unused OTP for this participant
    const { data: otpRecord, error: otpFetchError } =
      await supabaseAdmin
        .from("payment_otps")
        .select("*")
        .eq("bill_id", billId)
        .eq("participant_id", participantId)
        .eq("used", false)
        .order("created_at", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

    if (otpFetchError) {
      console.error(
        "OTP fetch error:",
        otpFetchError
      );

      return NextResponse.json(
        {
          error: "Unable to verify code.",
        },
        { status: 500 }
      );
    }

    if (!otpRecord) {
      return NextResponse.json(
        {
          error:
            "No active verification code found. Please request a new code.",
        },
        { status: 400 }
      );
    }

    // Check expiration
    if (
      new Date(otpRecord.expires_at).getTime() <
      Date.now()
    ) {
      return NextResponse.json(
        {
          error:
            "This verification code has expired. Please request a new one.",
        },
        { status: 400 }
      );
    }

    // Check maximum attempts
    if (otpRecord.attempts >= 5) {
      return NextResponse.json(
        {
          error:
            "Too many incorrect attempts. Please request a new code.",
        },
        { status: 429 }
      );
    }

    // Hash the OTP entered by the user
    const otpHash = crypto
      .createHash("sha256")
      .update(String(otp))
      .digest("hex");

    // Compare hashes
    if (otpHash !== otpRecord.otp_hash) {
      // Increase failed attempts
      await supabaseAdmin
        .from("payment_otps")
        .update({
          attempts: otpRecord.attempts + 1,
        })
        .eq("id", otpRecord.id);

      return NextResponse.json(
        {
          error: "Invalid verification code.",
        },
        { status: 400 }
      );
    }

    // OTP is correct — mark it as used
    const { error: updateError } =
      await supabaseAdmin
        .from("payment_otps")
        .update({
          used: true,
        })
        .eq("id", otpRecord.id);

    if (updateError) {
      console.error(
        "OTP update error:",
        updateError
      );

      return NextResponse.json(
        {
          error:
            "Verification succeeded, but we could not complete the verification process.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      verified: true,
      message: "Verification successful.",
    });
  } catch (error) {
    console.error(
      "Verify OTP error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while verifying the code.",
      },
      { status: 500 }
    );
  }
}