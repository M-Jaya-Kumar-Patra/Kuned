import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";

import Listing from "@/models/Listing";
import User from "@/models/User";

export async function POST(req: Request) {

  try {

    await dbConnect();

    const { userId, listingId, promotionType } = await req.json();

    const user = await User.findById(userId);
    const listing = await Listing.findById(listingId);

    if (!user || !listing) {
      return NextResponse.json(
        { message: "Invalid user or listing" },
        { status: 404 }
      );
    }

    let coinCost = 0;

    if (promotionType === "highlight") coinCost = 3;
    if (promotionType === "top") coinCost = 5;
    if (promotionType === "urgent") coinCost = 2;

    const totalCoins = user.bonusCoins + user.paidCoins;

    if (totalCoins < coinCost) {
      return NextResponse.json(
        { message: "Not enough coins" },
        { status: 400 }
      );
    }

    let remainingCost = coinCost;

    if (user.bonusCoins >= remainingCost) {
      user.bonusCoins -= remainingCost;
      remainingCost = 0;
    } else {
      remainingCost -= user.bonusCoins;
      user.bonusCoins = 0;
    }

    if (remainingCost > 0) {
      user.paidCoins -= remainingCost;
    }

    if (promotionType === "highlight") listing.isHighlighted = true;
    if (promotionType === "top") listing.isTopListing = true;
    if (promotionType === "urgent") listing.urgentSale = true;

    await user.save();
    await listing.save();

    return NextResponse.json({
      message: "Promotion applied successfully"
    });

  } catch (error) {

    return NextResponse.json(
      { message: "Promotion failed", error },
      { status: 500 }
    );

  }
}