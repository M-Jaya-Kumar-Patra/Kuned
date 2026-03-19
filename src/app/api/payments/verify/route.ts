import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Payment from "@/models/Payment";

export async function GET(req: Request) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");

  if (!orderId) {
    return NextResponse.json({ status: "invalid" });
  }

  const payment = await Payment.findOne({ orderId });

  if (!payment) {
    return NextResponse.json({ status: "pending" });
  }

  // ✅ DO NOT MODIFY STATUS HERE
  return NextResponse.json({
    status: payment.status, // initiated | success | failed
  });
}