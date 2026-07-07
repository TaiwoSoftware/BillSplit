import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const {
      email,
      name,
      billTitle,
      amount,
      billLink,
    } = await req.json();

    await resend.emails.send({
      from: "Contribution <onboarding@resend.dev>",
      to: email,
      subject: `You've been added to ${billTitle}`,
      html: `
        <h2>Hello ${name}</h2>

        <p>You have been added to a contribution.</p>

        <p><b>Bill:</b> ${billTitle}</p>

        <p><b>Your Amount:</b> ₦${Number(amount).toLocaleString()}</p>

        <a href="${billLink}">
          Click here to pay
        </a>

        <br/><br/>

        <p>Thank you.</p>
      `,
    });

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}