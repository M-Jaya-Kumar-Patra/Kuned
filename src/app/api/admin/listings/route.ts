import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { dbConnect } from "@/lib/dbConnect";
import Listing from "@/models/Listing";

export async function GET(req: Request) {

  const admin = await requireAdmin(req);
  if (admin instanceof Response) return admin;

  await dbConnect();

  const listings = await Listing.find()
    .populate("sellerId", "name email")
    .sort({ createdAt: -1 });

  return NextResponse.json(listings);
}