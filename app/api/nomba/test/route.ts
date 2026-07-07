import { NextResponse } from "next/server";
import { getNombaToken } from "@/app/lib/nomba";

export async function GET() {
  try {
    const token = await getNombaToken();

    return NextResponse.json({
      success: true,
      token,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error,
      },
      {
        status: 500,
      }
    );
  }
}