import { NextResponse } from "next/server";
import RecentlyViewed from "@/models/RecentlyViewed";
import { requireAuth } from "@/lib/requireAuth";
import {dbConnect} from "@/lib/dbConnect";

export async function POST(req: Request) {
  await dbConnect();

  const user = requireAuth(req); if (user instanceof Response) return user;
  const { listingId } = await req.json();

  await RecentlyViewed.findOneAndUpdate(
    {
      userId: user.id,
      listingId
    },
    {},
    { upsert: true, new: true }
  );

  return NextResponse.json({ success: true });
}

export async function GET(req: Request) {
  await dbConnect();

  const user = requireAuth(req); if (user instanceof Response) return user;

  const items = await RecentlyViewed.find({
    userId: user.id
  })
    .populate("listingId")
    .sort({ updatedAt: -1 })
    .limit(10);

  return NextResponse.json(items);
}