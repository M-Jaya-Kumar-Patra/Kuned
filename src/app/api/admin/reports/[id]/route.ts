import { dbConnect } from "@/lib/dbConnect";
import Report from "@/models/Report";
import Listing from "@/models/Listing";
import User from "@/models/User";
import { calculateTrustScore } from "@/lib/trustScore";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {

  await dbConnect();

  const { id } = await context.params;

  const { status } = await req.json();

  const report = await Report.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!report) {
    return NextResponse.json(
      { message: "Report not found" },
      { status: 404 }
    );
  }

  // ⭐ Update seller trust score
  if (report.targetType === "listing") {

    const listing = await Listing.findById(report.targetId);

    if (listing) {

      const seller = await User.findById(listing.sellerId);

      if (seller) {

        if (status === "resolved") {
          seller.totalReports += 1;
        }

        if (status === "rejected" && seller.totalReports > 0) {
          seller.totalReports -= 1;
        }

        seller.trustScore = calculateTrustScore(seller);

        await seller.save();

      }

    }

  }

  return NextResponse.json(report);

}