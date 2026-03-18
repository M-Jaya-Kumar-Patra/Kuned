import Listing from "@/models/Listing";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

  const { listingId, status } = await req.json();

  const listing = await Listing.findByIdAndUpdate(
    listingId,
    { status },
    { returnDocument: "after" }
  );

  return NextResponse.json(listing);
}