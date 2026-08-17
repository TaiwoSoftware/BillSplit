import { supabaseAdmin } from "@/app/lib/supabase-admin";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
    try {
        const { billId, participantId } = await request.json();

        if (!billId || !participantId) {
            return NextResponse.json(
                {
                    error: "Bill ID and participant ID are required.",
                },
                { status: 400 }
            );
        }

        // Get the participant
        const { data: participant, error: participantError } =
            await supabaseAdmin
                .from("bill_participants")
                .select("id, bill_id, name, email, amount, payment_status")
                .eq("id", participantId)
                .eq("bill_id", billId)
                .maybeSingle();

        if (participantError) {
            console.error(participantError);

            return NextResponse.json(
                {
                    error: "Unable to find participant.",
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

        if (participant.payment_status === "paid") {
            return NextResponse.json(
                {
                    error: "This contribution has already been paid.",
                },
                { status: 400 }
            );
        }

        // Generate a cryptographically secure 6-digit OTP
        const otp = crypto
            .randomInt(100000, 1000000)
            .toString();

        // Hash the OTP before storing it
        const otpHash = crypto
            .createHash("sha256")
            .update(otp)
            .digest("hex");

        // OTP expires in 5 minutes
        const expiresAt = new Date(
            Date.now() + 5 * 60 * 1000
        ).toISOString();


        const { error: otpInsertError } = await supabaseAdmin
            .from("payment_otps")
            .insert({
                bill_id: billId,
                participant_id: participantId,
                otp_hash: otpHash,
                expires_at: expiresAt,
                used: false,
                attempts: 0,
            });

        if (otpInsertError) {
            console.error(
                "OTP database error:",
                otpInsertError
            );

            return NextResponse.json(
                {
                    error: "Unable to create verification code.",
                },
                { status: 500 }
            );
        }

        // Send the OTP email
        const { error: emailError } = await resend.emails.send({
            from:
                process.env.RESEND_FROM_EMAIL ||
                "BillSplit <onboarding@resend.dev>",

            to: [participant.email],

            subject: "Your BillSplit payment verification code",

            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px;">
          
          <h2 style="color: #2563eb;">
            BillSplit Payment Verification
          </h2>

          <p>
            Hi ${participant.name},
          </p>

          <p>
            You're about to make a payment of
            <strong>
              ₦${Number(participant.amount).toLocaleString()}
            </strong>
            on BillSplit.
          </p>

          <p>
            Use the verification code below to continue:
          </p>

          <div style="
            background: #f1f5f9;
            padding: 20px;
            text-align: center;
            border-radius: 12px;
            margin: 25px 0;
          ">
            <span style="
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
              color: #1e293b;
            ">
              ${otp}
            </span>
          </div>

          <p>
            This code expires in <strong>5 minutes</strong>.
          </p>

          <p style="color: #64748b;">
            If you didn't attempt to make this payment,
            you can safely ignore this email.
          </p>

          <p>
            — BillSplit
          </p>

        </div>
      `,
        });

        if (emailError) {
            console.error(
                "Email sending error:",
                emailError
            );

            return NextResponse.json(
                {
                    error:
                        "Unable to send verification email.",
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message:
                "Verification code sent successfully.",
        });
    } catch (error) {
        console.error("Request OTP error:", error);

        return NextResponse.json(
            {
                error:
                    "Something went wrong while sending the verification code.",
            },
            { status: 500 }
        );
    }
}