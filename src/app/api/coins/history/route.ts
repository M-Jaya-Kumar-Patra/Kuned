import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { requireAuth } from "@/lib/requireAuth";
import CoinTransaction from "@/models/coinTransaction";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const auth = requireAuth(req);
    if (auth instanceof Response) return auth;

    const transactions = await CoinTransaction
      .find({ userId: auth.id })
      .sort({ createdAt: -1 });

    return NextResponse.json(transactions);

  } catch (error) {

    return NextResponse.json(
      { message: "Failed to fetch coin history" },
      { status: 500 }
    );

  }
}