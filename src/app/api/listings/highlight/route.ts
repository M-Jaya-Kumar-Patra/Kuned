import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";
import { dbConnect } from "@/lib/dbConnect";
import Listing from "@/models/Listing";
import { spendCoins } from "@/utils/coinService";
import { COIN_COST } from "@/constants/coins";

export async function POST(req: Request) {

  const auth = await requireAuth(); if (auth instanceof Response) return auth;

  await dbConnect();

  const { listingId } = await req.json();

  // ⭐ Save returned user
  const user = await spendCoins(
    auth.id,
    COIN_COST.HIGHLIGHT_LISTING,
    "highlight_listing"
  );

  await Listing.findByIdAndUpdate(listingId, {
    isHighlighted: true
  });

  return NextResponse.json({
    message: "Listing upgraded",
    bonusCoins: user.bonusCoins,
    paidCoins: user.paidCoins
  });
}