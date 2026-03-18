import { NextResponse } from "next/server";
import Wishlist from "@/models/Wishlist";
import { requireAuth } from "@/lib/requireAuth";
import { dbConnect } from "@/lib/dbConnect";

export async function GET(req: Request) {
  await dbConnect();

  const user = requireAuth(req); if (user instanceof Response) return user;

  const { searchParams } = new URL(req.url);
  const listingId = searchParams.get("listingId");

  const existing = await Wishlist.findOne({
    userId: user.id,
    listingId
  });

  return NextResponse.json({
    saved: !!existing
  });
}