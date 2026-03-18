import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import coinTransaction from "@/models/coinTransaction";
import { requireAuth } from "@/lib/requireAuth";

export async function POST(req: Request) {
  await dbConnect();

  const auth = requireAuth(req);

  if (auth instanceof NextResponse) {
    return auth;
  }

  const userId = auth.id;

  const { amount, source } = await req.json();

  if (!amount || amount <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  const user = await User.findById(userId);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // 🔥 CHECK BALANCE
  if (user.paidCoins < amount) {
    return NextResponse.json(
      { error: "Insufficient coins" },
      { status: 400 }
    );
  }

  // 🔥 DEDUCT COINS
  user.paidCoins -= amount;
  await user.save();

  // 🔥 SAVE TRANSACTION
  await coinTransaction.create({
    userId,
    amount,
    coinType: "paid",
    transactionType: "spend",
    source: source || "feature_usage"
  });

  return NextResponse.json({
    success: true,
    remainingCoins: user.paidCoins
  });
}