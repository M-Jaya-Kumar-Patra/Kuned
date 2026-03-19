import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Payment from "@/models/Payment";
import User from "@/models/User";
import CoinTransaction from "@/models/coinTransaction";
import crypto from "crypto";

export async function POST(req: Request) {
  await dbConnect();

  try {
    // ✅ STEP 1: get RAW body (important for signature)
    const body = await req.text();

    // ✅ STEP 2: VERIFY SIGNATURE (ADD HERE)
    const signature = req.headers.get("x-webhook-signature");
    const secret = process.env.CASHFREE_WEBHOOK_SECRET!;

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("base64");

    if (signature !== expectedSignature) {
      console.log("❌ Invalid webhook signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    // ✅ STEP 3: now parse JSON (AFTER verification)
    const data = JSON.parse(body);

    const orderId = data?.data?.order?.order_id?.trim();
    const status = data?.data?.payment?.payment_status;

    if (!orderId) {
      return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
    }

    const payment = await Payment.findOne({ orderId });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    if (payment.status === "success") {
      return NextResponse.json({ message: "Already processed" });
    }

    if (status === "SUCCESS") {
      await Payment.updateOne(
        { orderId },
        { $set: { status: "success" } }
      );

      await User.findByIdAndUpdate(payment.userId, {
        $inc: { paidCoins: payment.coins }
      });

      const existingTx = await CoinTransaction.findOne({ orderId });

      if (!existingTx) {
        await CoinTransaction.create({
          userId: payment.userId,
          amount: payment.coins,
          coinType: "paid",
          transactionType: "earn",
          source: "coin_purchase",
          orderId
        });
      }
    }

    if (status === "FAILED") {
      await Payment.updateOne(
        { orderId },
        { $set: { status: "failed" } }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Webhook error:", error);

    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}