import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";
import { dbConnect } from "@/lib/dbConnect";
import Listing from "@/models/Listing";

export async function GET(req: Request) {

  const auth = requireAuth(req);

  if (auth instanceof Response) return auth;

  await dbConnect();

  const listings = await Listing.find({
    sellerId: auth.id
  }).sort({ createdAt: -1 });

  return NextResponse.json(listings);
}