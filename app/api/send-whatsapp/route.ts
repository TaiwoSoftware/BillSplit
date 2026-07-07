import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export async function POST(req: NextRequest) {
  try {
    const {
      phone,
      name,
      billTitle,
      amount,
      link,
    } = await req.json();

    const message = await client.messages.create({
      from: "whatsapp:+14155238886", // Twilio Sandbox number
      to: `whatsapp:${phone}`,
      body: `
Hello ${name} 👋

You have been added to a contribution.

Bill: ${billTitle}

Amount: ₦${amount}

Pay here:

${link}

Thank you.
`,
    });

    return NextResponse.json({
      success: true,
      sid: message.sid,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}