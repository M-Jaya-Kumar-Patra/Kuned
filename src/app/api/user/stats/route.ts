import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { requireAuth } from "@/lib/requireAuth";
import Listing from "@/models/Listing";
import Conversation from "@/models/Conversation";

export async function GET(req: Request) {

  try {

    await dbConnect();

    const user = requireAuth(req);

    const listings = await Listing.countDocuments({
      sellerId: user.id
    });

    const chats = await Conversation.countDocuments({
      participants: user.id
    });

    return NextResponse.json({
      listings,
      chats
    });

  } catch (error) {

    return NextResponse.json(
      { message: "Unauthorized" , error},
      { status: 401 }
    );

  }

}