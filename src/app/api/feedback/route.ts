// /api/feedback/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Feedback from "@/models/Feedback";

export async function POST(req: Request) {
  await dbConnect();

  const body = await req.json();

  const feedback = await Feedback.create({
    message: body.message,
    type: body.type,
  });

  return NextResponse.json({ success: true, feedback });
}