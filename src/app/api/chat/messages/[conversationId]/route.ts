import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { requireAuth } from "@/lib/requireAuth";
import Message from "@/models/Message";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {

  const auth = requireAuth(req); if (auth instanceof Response) return auth;
  if (auth instanceof Response) return auth;

  await dbConnect();

  const { conversationId } = await params;

  

  const messages = await Message.find({
    conversationId
  }).sort({ createdAt: 1 });

  return NextResponse.json({ messages });

}