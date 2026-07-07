import { NextRequest, NextResponse } from "next/server";
import { verifyNombaPayment } from "@/app/lib/verifyNombaPayment";

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

    return NextResponse.json({
      success: true,
      result,
    });

  } catch (error) {

    console.error(error);

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