import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";
import { dbConnect } from "@/lib/dbConnect";
import Report from "@/models/Report";
import { calculateTrustScore } from "@/lib/trustScore";
import Listing from "@/models/Listing";
import User from "@/models/User";


export async function POST(req: Request) {

  const auth = requireAuth(req);
  if (auth instanceof Response) return auth;

  const { targetType, targetId, reason, description } = await req.json();

  

  if (!targetType || !targetId || !reason) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  await dbConnect();

  const existing = await Report.findOne({
    reporterId: auth.id,
    targetType,
    targetId
  });

  if (existing) {
    return NextResponse.json(
      { message: "You already reported this item" },
      { status: 400 }
    );
  }

  const report = await Report.create({
    reporterId: auth.id,
    targetType,
    targetId,
    reason,
    description
  });

  if (targetType === "listing") {

  const listing = await Listing.findById(targetId);

  if (listing) {

    listing.reportCount += 1;

    if (listing.reportCount >= 5) {
      listing.hidden = true;
    }

    await listing.save();
  }

}
  // decrease trust score of seller if listing is reported
if (targetType === "listing") {

  const listing = await Listing.findById(targetId);

  if (listing) {

    const seller = await User.findById(listing.sellerId);

    if (seller) {

      seller.totalReports += 1;

      seller.trustScore = calculateTrustScore(seller);

      await seller.save();

    }

  }

}

  return NextResponse.json({
    message: "Report submitted",
    report
  });

}