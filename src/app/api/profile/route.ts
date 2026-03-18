import { NextResponse } from "next/server";
import Listing from "@/models/Listing";
import User from "@/models/User";
import { requireAuth } from "@/lib/requireAuth";
import { dbConnect } from "@/lib/dbConnect";

export async function GET(req: Request) {

  const auth = requireAuth(req); if (auth instanceof Response) return auth;
  if (auth instanceof Response) return auth;

  const user = auth as { id: string };

  await dbConnect();

  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);

  const skip = (page - 1) * limit;

  const listings = await Listing.find({
    sellerId: user.id
  })
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit);

  const totalListings = await Listing.countDocuments({
    sellerId: user.id
  });

  const userDoc = await User.findById(user.id).select(
    "name email bonusCoins paidCoins"
  );

  return NextResponse.json({
    listings,
    totalListings,
    totalPages: Math.ceil(totalListings / limit),
    page,
    user: userDoc
  });
}