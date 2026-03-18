import { NextResponse } from "next/server";
import Conversation from "@/models/Conversation";
import { requireAuth } from "@/lib/requireAuth";
import { dbConnect } from "@/lib/dbConnect";

export async function POST(req: Request) {

  const auth = requireAuth(req);
  if (auth instanceof Response) return auth;

  const { sellerId, listingId } = await req.json();

  await dbConnect();

  let conversation = await Conversation.findOne({
    participants: { $all: [auth.id, sellerId] },
    listingId
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [auth.id, sellerId],
      listingId
    });
  }

  return NextResponse.json({conversation});
}