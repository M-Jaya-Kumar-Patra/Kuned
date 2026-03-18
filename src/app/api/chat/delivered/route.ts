import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { requireAuth } from "@/lib/requireAuth";
import Message from "@/models/Message";



export async function POST(req: Request) {

  const auth = await requireAuth(req);

  await dbConnect();

  const { messageId } = await req.json();

  await Message.findByIdAndUpdate(
    messageId,
    { delivered: true }
  );

  return NextResponse.json({ success: true });

}