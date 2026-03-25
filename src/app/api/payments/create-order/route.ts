import { NextResponse } from "next/server";
import crypto from "crypto";
import { dbConnect } from "@/lib/dbConnect";
import Payment from "@/models/Payment";
import { requireAuth } from "@/lib/requireAuth";

export async function POST(req: Request) {
  await dbConnect();

  const auth = requireAuth(req);
  if (auth instanceof Response) return auth;

  const userId = auth.id;

  const { packageId } = await req.json();

  const packages: Record<string, { coins: number; price: number }> = {
    starter: { coins: 10, price: 10 },
    popular: { coins: 50, price: 39 },
    pro: { coins: 120, price: 79 },
  };

  const pkg = packages[packageId];

  if (!pkg) {
    return NextResponse.json({ error: "Invalid package" }, { status: 400 });
  }

  const orderId = "order_" + crypto.randomUUID();

  // ✅ ENV BASED URL
  const CASHFREE_BASE_URL =
    process.env.CASHFREE_ENV === "PRODUCTION"
      ? "https://api.cashfree.com"
      : "https://sandbox.cashfree.com";

  const orderRequest = {
    order_id: orderId,
    order_amount: pkg.price,
    order_currency: "INR",

    customer_details: {
      customer_id: userId,
      customer_email: auth.email || "test@gmail.com",
      customer_phone: auth.phone || "9999999999"
    },

    order_meta: {
      notify_url: process.env.WEBHOOK_URL!,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment-status?orderId=${orderId}`,
    },
  };

  try {
    const response = await fetch(`${CASHFREE_BASE_URL}/pg/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": process.env.CASHFREE_APP_ID!,
        "x-client-secret": process.env.CASHFREE_SECRET_KEY!,
        "x-api-version": "2023-08-01",
      },
      body: JSON.stringify(orderRequest),
    });

    const data = await response.json();

    if (!data.payment_session_id) {
      console.error("❌ Cashfree error:", data);

      return NextResponse.json(
        { error: "Failed to create payment session" },
        { status: 500 }
      );
    }

    await Payment.create({
      userId,
      orderId,
      amount: pkg.price,
      coins: pkg.coins,
      status: "initiated",
      paymentSessionId: data.payment_session_id,
    });

    return NextResponse.json({
      paymentSessionId: data.payment_session_id,
    });

  } catch (error) {
    console.error("❌ Cashfree request failed:", error);

    return NextResponse.json(
      { error: "Cashfree order creation failed" },
      { status: 500 }
    );
  }
}