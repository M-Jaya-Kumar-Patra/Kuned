import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Listing from "@/models/Listing";
import User from "@/models/User";

User;

export async function GET(req: Request) {

  try {

    await dbConnect();

    
    const { searchParams } = new URL(req.url);
    
    console.log("rrrrrrrrrrrrrrrrrrrrrrr: ", searchParams)
    const keyword = searchParams.get("keyword");
    const category = searchParams.get("category");
    const location = searchParams.get("location");

    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);



    const query: Record<string, unknown> = {};

    if (keyword) {
      query.title = { $regex: keyword, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    if (location) {
      query.location = location;
    }

    const priceFilter: { $gte?: number; $lte?: number } = {};

    if (minPrice && !isNaN(Number(minPrice))) {
  priceFilter.$gte = Number(minPrice);
}

if (maxPrice && !isNaN(Number(maxPrice))) {
  priceFilter.$lte = Number(maxPrice);
}
    if (minPrice || maxPrice) {
      query.price = priceFilter;
    }
const listings = await Listing.find(query)
  .populate({
    path: "sellerId",
    select: "banned",
    match: { banned: { $ne: true } }
  })
  .sort({
    isTopListing: -1,
    isHighlighted: -1,
    createdAt: -1
  })
  .skip((page - 1) * limit)
  .limit(limit).lean();

// remove listings whose seller was banned
const filteredListings = listings.filter(l => l.sellerId !== null);


return NextResponse.json({
  success: true,
  listings: filteredListings
});

  

  } catch (error) {

  console.error("Listings error:", error);

  return NextResponse.json(
    { 
      message: "Failed to fetch listings", 
      error: error instanceof Error ? error.message : "Unknown error"
    },
    { status: 500 }
  );

}
}