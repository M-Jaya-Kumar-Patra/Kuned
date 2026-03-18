import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Payment from "@/models/Payment";

export async function GET(req: Request) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");

  if (!orderId) {
    return NextResponse.json({ success: false, status: "invalid" });
  }

  const payment = await Payment.findOne({ orderId });

  if (!payment) {
    return NextResponse.json({ success: false, status: "not_found" });
  }

  // 🔥 AUTO FIX PENDING → FAILED (IMPORTANT)
  if (payment.status === "initiated") {
    payment.status = "failed";
    await payment.save();
  }

  return NextResponse.json({
    success: payment.status === "success",
    status: payment.status
  });
}