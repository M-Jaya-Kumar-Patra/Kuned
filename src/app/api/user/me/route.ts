import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import { requireAuth } from "@/lib/requireAuth";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const auth = requireAuth(req);
    if (auth instanceof Response) return auth;

    if (auth instanceof NextResponse) return auth;

    // ✅ Get current user
    const dbUser = await User.findById(auth.id).select(
      "name email bonusCoins paidCoins referralCode avatar banned",
    );

    if (!dbUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // ✅ Count referrals
    const referralCount = await User.countDocuments({
      referredBy: dbUser._id.toString(),
    });

    const referralCoins = referralCount * 10;

    return NextResponse.json({
      user: dbUser,
      referrals: referralCount,
      referralCoins,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Unauthorized", error },
      { status: 401 },
    );
  }
}
