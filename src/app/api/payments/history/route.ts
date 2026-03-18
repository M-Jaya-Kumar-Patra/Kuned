import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Payment from "@/models/Payment";
import { requireAuth } from "@/lib/requireAuth";

export async function GET(req: Request) {
  await dbConnect();

  const auth = requireAuth(req);

  if (auth instanceof NextResponse) {
    return auth;
  }

  const userId = auth.id;

  const payments = await Payment.find({ userId })
    .sort({ createdAt: -1 });

  return NextResponse.json({ payments });
}