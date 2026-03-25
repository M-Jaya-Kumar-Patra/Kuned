import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";
import { dbConnect } from "@/lib/dbConnect";
import { earnCoins } from "@/utils/coinService";

export async function POST(req: Request) {

  const auth = requireAuth(req); if (auth instanceof Response) return auth;

  await dbConnect();

  const { amount, coinType, source } = await req.json();

  await earnCoins(auth.id, amount, coinType, source);

  return NextResponse.json({
    message: "Coins added successfully"
  });
}