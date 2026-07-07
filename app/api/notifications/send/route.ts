import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();

    console.log("Sending Notifications");

    console.dir(body,{depth:null});

    return NextResponse.json({
        success:true
    });
}