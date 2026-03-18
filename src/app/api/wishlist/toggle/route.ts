import { NextResponse } from "next/server";
import Wishlist from "@/models/Wishlist";
import { requireAuth } from "@/lib/requireAuth";
import { dbConnect } from "@/lib/dbConnect";

export async function POST(req: Request) {
  await dbConnect();

  const user = requireAuth(req); if (user instanceof Response) return user;

  const { listingId } = await req.json();

  const existing = await Wishlist.findOne({
    userId: user.id,
    listingId,
  });

  if (existing) {
    await existing.deleteOne();

    return NextResponse.json({
      saved: false,
      message: "Removed from wishlist",
    });
  }

  await Wishlist.create({
    userId: user.id,
    listingId,
  });

  return NextResponse.json({
    saved: true,
    message: "Saved to wishlist",
  });
}