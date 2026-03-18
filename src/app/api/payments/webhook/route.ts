import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Payment from "@/models/Payment";
import User from "@/models/User";
import CoinTransaction from "@/models/coinTransaction";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const data = await req.json();

    console.log("🔥 FULL WEBHOOK DATA:", JSON.stringify(data, null, 2));

    const orderId = data?.data?.order?.order_id?.trim();
    const status = data?.data?.payment?.payment_status;

    console.log("OrderId:", orderId);
    console.log("Status:", status);

    if (!orderId) {
      return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
    }

    // 🔥 ATOMIC UPDATE (MOST IMPORTANT FIX)
    const payment = await Payment.findOneAndUpdate(
      {
        orderId,
        status: { $ne: "success" } // only update if NOT already success
      },
      {
        $set: { status: "success" }
      },
      { new: true }
    );

    // 👉 If null → already processed
    if (!payment) {
      console.log("⚠️ Already processed or payment not found");
      return NextResponse.json({ message: "Already processed" });
    }

    if (status === "SUCCESS") {
      console.log("✅ SUCCESS");

      // 🔥 ADD COINS
      await User.findByIdAndUpdate(payment.userId, {
        $inc: { paidCoins: payment.coins }
      });

      // 🔥 EXTRA SAFETY (prevent duplicate transactions)
      const existingTx = await CoinTransaction.findOne({
        userId: payment.userId,
        amount: payment.coins,
        source: "coin_purchase"
      });

      if (!existingTx) {
        await CoinTransaction.create({
          userId: payment.userId,
          amount: payment.coins,
          coinType: "paid",
          transactionType: "earn",
          source: "coin_purchase"
        });

        console.log("🎉 Coins added!");
      } else {
        console.log("⚠️ Duplicate transaction prevented");
      }
    }
    else if (status === "FAILED") {
  console.log("❌ Payment FAILED");

  await Payment.findOneAndUpdate(
    { orderId },
    { $set: { status: "failed" } }
  );
}
else {
  console.log("⚠️ Unknown status:", status);
}

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("❌ Webhook error:", error);

    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}