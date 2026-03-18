import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";
import { dbConnect } from "@/lib/dbConnect";

import Listing from "@/models/Listing";

import { spendCoins } from "@/utils/coinService";
import { COIN_COST } from "@/constants/coins";

export async function POST(req: Request) {

  const auth = requireAuth(req); if (auth instanceof Response) return auth;
  if (auth instanceof Response) return auth;

  await dbConnect();

  const { listingId } = await req.json();

  if (!listingId) {
    return NextResponse.json(
      { message: "Listing ID is required" },
      { status: 400 }
    );
  }

  try {

    // deduct coins
    const user = await spendCoins(auth.id, COIN_COST.URGENT_SALE, "urgent_sale");

    // update listing
    const listing = await Listing.findByIdAndUpdate(
      listingId,
      { urgentSale: true },
      { new: true }
    );

    if (!listing) {
      return NextResponse.json(
        { message: "Listing not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
  message: "Listing upgraded",
  bonusCoins: user.bonusCoins,
  paidCoins: user.paidCoins
});

  } catch (error: unknown) {

    const message =
      error instanceof Error ? error.message : "Something went wrong";

    return NextResponse.json(
      { message },
      { status: 400 }
    );

  }

}