import { NextResponse } from "next/server";
import Wishlist from "@/models/Wishlist";
import { requireAuth } from "@/lib/requireAuth";
import { dbConnect } from "@/lib/dbConnect";
export async function GET(req: Request) {
  await dbConnect();

  const user = requireAuth(req); if (user instanceof Response) return user;

  const saved = await Wishlist.find({ userId: user.id })
    .populate("listingId")
    .sort({ createdAt: -1 });

  return NextResponse.json(saved);
}