import { spendCoins } from "@/utils/coinService";   // ✅ ADD THIS
// import { COIN_COST } from "@/constants/coins";
import { dbConnect } from "@/lib/dbConnect";
import { requireAuth } from "@/lib/requireAuth";
import Listing from "@/models/Listing";
import User from "@/models/User";
import coinTransaction from "@/models/coinTransaction";
import { NextResponse } from "next/server";
import { COIN_COST } from "@/constants/coins";


export async function POST(req: Request) {

    

  const auth = requireAuth(req); if (auth instanceof Response) return auth;

  await dbConnect();

  const { listingId } = await req.json();

  if (!listingId) {
    return NextResponse.json(
      { message: "Listing ID is required" },
      { status: 400 }
    );
  }

  try {

    // deduct coins and get updated user
    const user = await spendCoins(
      auth.id,
      COIN_COST.TOP_LISTING,
      "top_listing"
    );

    const listing = await Listing.findByIdAndUpdate(
      listingId,
      { topListing: true },
      { new: true }
    );

    if (!listing) {
      return NextResponse.json(
        { message: "Listing not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Listing upgraded to Top Listing",
      listing,
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