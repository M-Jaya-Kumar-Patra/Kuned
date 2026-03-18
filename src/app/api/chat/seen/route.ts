import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { requireAuth } from "@/lib/requireAuth";
import Message from "@/models/Message";

export async function POST(req: Request) {

  const auth = requireAuth(req); if (auth instanceof Response) return auth;
  if (auth instanceof Response) return auth;

  await dbConnect();

  const { conversationId } = await req.json();

  await Message.updateMany(
    {
      conversationId,
      senderId: { $ne: auth.id }
    },
    {
      $set: { seen: true }
    }
  );

  return NextResponse.json({ success: true });
}