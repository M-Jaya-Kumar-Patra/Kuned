import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import WithdrawalRequest from "@/models/WithdrawalRequest";
import User from "@/models/User";
import { requireAuth } from "@/lib/requireAuth";
import { sendEmail } from "@/lib/email";
import { withdrawalEmail } from "@/lib/emailTemplates/withdrawalEmail";

export async function POST(req: Request) {
  await dbConnect();

  const auth = await requireAuth(); if (auth instanceof Response) return auth;
  if (auth instanceof NextResponse) return auth;

  const userId = auth.id;

  const { amount, bankName, accountNumber, ifsc, accountHolderName } = await req.json();

  const amountNum = Number(amount);
  const user = await User.findById(userId);

  // ❌ invalid amount
if (!amountNum || amountNum <= 0) {
  return NextResponse.json(
    { error: "Invalid amount" },
    { status: 400 }
  );
}

// ❌ insufficient balance
if (amountNum > user.paidCoins) {
  return NextResponse.json(
    { error: "Insufficient balance" },
    { status: 400 }
  );
}

  // ✅ deduct coins immediately (important)
  user.paidCoins -= amount;
  await user.save();

  // ✅ store request
  await WithdrawalRequest.create({
    userId,
    amount,
    bankName,
    accountNumber,
    ifsc,
    accountHolderName
  });

  await sendEmail({
  to: process.env.COMPANY_EMAIL as string, // 👈 YOUR EMAIL
  subject: "New Withdrawal Request",
  html: withdrawalEmail({
    name: user.name,
    email: user.email,
    amount,
    bankName,
    accountNumber,
    ifsc,
    accountHolderName,
  }),
});

await sendEmail({
  to: user.email,
  subject: "Withdrawal Request Submitted",
  html: `
    <p>Hi ${user.name},</p>
    <p>Your withdrawal request of ₹${amount} has been received.</p>
    <p>We will process it shortly.</p>
  `,
});


  return NextResponse.json({ success: true });
}