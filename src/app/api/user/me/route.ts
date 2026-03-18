import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import { requireAuth } from "@/lib/requireAuth";



export async function GET(req: Request) {
  try {
    await dbConnect();

    const auth = requireAuth(req);

    if (auth instanceof NextResponse) return auth;

    const dbUser = await User.findById(auth.id).select(
      "name email bonusCoins paidCoins referralCode avatar banned"
    );

    return NextResponse.json({
      user: dbUser // ✅ FIX
    });

  } catch (error) {
    return NextResponse.json(
      { message: "Unauthorized", error },
      { status: 401 }
    );
  }
}