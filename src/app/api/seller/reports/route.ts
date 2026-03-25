import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";
import { dbConnect } from "@/lib/dbConnect";
import Report from "@/models/Report";
import Listing from "@/models/Listing";

export async function GET(req: Request) {

  const auth = requireAuth(req); if (auth instanceof Response) return auth;

  await dbConnect();

  // get listings owned by seller
  const listings = await Listing.find({
    sellerId: auth.id
  }).select("_id");

  const listingIds = listings.map(l => l._id);

  // find reports related to seller listings
  const reports = await Report.find({
  targetType: "listing",
  targetId: { $in: listingIds }
})
.populate("reporterId", "_id name email")
.populate({
  path: "targetId",
  model: "Listing",
  select: "_id slug title"
})
.sort({ createdAt: -1 });

  return NextResponse.json(reports);

}
