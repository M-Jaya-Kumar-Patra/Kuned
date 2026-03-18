import { NextResponse } from "next/server";
import crypto from "crypto";
import { dbConnect } from "@/lib/dbConnect";
import Payment from "@/models/Payment";
import { requireAuth } from "@/lib/requireAuth";

export async function POST(req: Request) {
  await dbConnect();

  const auth = requireAuth(req); if (auth instanceof Response) return auth;

  if (auth instanceof NextResponse) {
    return auth;
  }

  const userId = auth.id;

  const { packageId } = await req.json();

  const packages: Record<string, { coins: number; price: number }> = {
    starter: { coins: 10, price: 49 },
    popular: { coins: 25, price: 99 },
    pro: { coins: 60, price: 199 },
  };

  const pkg = packages[packageId];

  if (!pkg) {
    return NextResponse.json({ error: "Invalid package" }, { status: 400 });
  }

  const orderId = "order_" + crypto.randomUUID();

  const orderRequest = {
    order_id: orderId,
    order_amount: pkg.price,
    order_currency: "INR",

    customer_details: {
      customer_id: userId,
      customer_email: auth.email || "test@gmail.com",
      customer_phone: "9999999999",
    },

    order_meta: {
    notify_url: "https://nonstarting-joya-unexamined.ngrok-free.dev/api/payments/webhook",
  return_url: `http://localhost:3000/payment-status?orderId=${orderId}`
  }
  };

  try {
    const response = await fetch("https://sandbox.cashfree.com/pg/orders", {
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
      console.error("Missing session id:", data);

      return NextResponse.json(
        { error: "Invalid Cashfree response" },
        { status: 500 },
      );
    }

    await Payment.create({
      userId,
      orderId,
      amount: pkg.price,
      coins: pkg.coins,
      status: "initiated",
      paymentSessionId: data.payment_session_id, // optional
    });

    return NextResponse.json({
      paymentSessionId: data.payment_session_id,
    });
  } catch (error) {
    console.error("Cashfree error:", error);

    return NextResponse.json(
      { error: "Cashfree order creation failed" },
      { status: 500 },
    );
  }
}
