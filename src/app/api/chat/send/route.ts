import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { requireAuth } from "@/lib/requireAuth";

import Message from "@/models/Message";
import Conversation from "@/models/Conversation";
import User from "@/models/User";
import Notification from "@/models/Notification";

import mongoose from "mongoose";



Conversation;
User;

export async function POST(req: Request) {
  try {
    const auth = requireAuth(req); if (auth instanceof Response) return auth;
    if (auth instanceof Response) return auth;

    await dbConnect();

    const { conversationId, text } = await req.json();

    if (!conversationId || !text?.trim()) {
      return NextResponse.json(
        { message: "conversationId and text are required" },
        { status: 400 }
      );
    }

    const message = await Message.create({
      conversationId,
      senderId: auth.id,
      text: text.trim(),
    });

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return NextResponse.json(
        { message: "Conversation not found" },
        { status: 404 }
      );
    }

    const receiverId = conversation.participants.find(
      (p: mongoose.Types.ObjectId) => p.toString() !== auth.id
    );

    if (!receiverId) {
      return NextResponse.json(
        { message: "Receiver not found" },
        { status: 404 }
      );
    }

    await Notification.create({
      userId: receiverId,
      senderId: auth.id,
      title: "New message",
      message: text.slice(0, 50),
      type: "chat"
    });

    return NextResponse.json({ message });

  } catch (error) {

    console.error("SEND MESSAGE ERROR:", error);

    return NextResponse.json(
      { message: "Failed to send message", error },
      { status: 500 }
    );
  }
}