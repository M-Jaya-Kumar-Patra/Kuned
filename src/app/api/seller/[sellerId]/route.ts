import { NextResponse } from "next/server";
import {dbConnect} from "@/lib/dbConnect";
import Listing from "@/models/Listing";
import User from "@/models/User";


export async function GET(
  req: Request,
  { params }: { params: Promise<{ sellerId: string }> }
) {

  await dbConnect();

  const { sellerId } = await params;  // ⭐ FIX

  console.log("sellerId received:", sellerId);

  const seller = await User.findById(sellerId).select(
    "name avatar createdAt  trustScore totalSales totalReports"
  );

  if (!seller) {
    return NextResponse.json(
      { error: "Seller not found" },
      { status: 404 }
    );
  }

  const listings = await Listing.find({
    sellerId: sellerId
  }).sort({ createdAt: -1 });

  return NextResponse.json({
    user: seller,
    listings
  });
}