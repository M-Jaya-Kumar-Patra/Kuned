import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { dbConnect } from "@/lib/dbConnect";
import Listing from "@/models/Listing";

export async function POST(req: Request) {

  const admin = await requireAdmin(req);
  if (admin instanceof Response) return admin;

  const { listingId } = await req.json();

  await dbConnect();

  await Listing.findByIdAndDelete(listingId);

  return NextResponse.json({ message: "Listing deleted" });
}