import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { requireAuth } from "@/lib/requireAuth";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";
import User from "@/models/User";
import Listing from "@/models/Listing";


User;
Listing;


export async function GET(req: Request) {

  const auth = await requireAuth(); 
  if (auth instanceof Response) return auth;

  await dbConnect();

  const conversations = await Conversation.find({
    participants: auth.id
  })
  .populate("participants", "name")
  .populate("listingId", "title images")
  .lean();

  const result = await Promise.all(
    conversations.map(async (conv) => {

      const unseenCount = await Message.countDocuments({
        conversationId: conv._id,
        senderId: { $ne: auth.id },
        seen: false
      });

      return {
        ...conv,
        unseenCount
      };

    })
  );

  return NextResponse.json({
    conversations: result
  });

}