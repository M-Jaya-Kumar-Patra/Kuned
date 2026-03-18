import { NextResponse } from "next/server";
import Notification from "@/models/Notification";
import { requireAuth } from "@/lib/requireAuth";
import { dbConnect } from "@/lib/dbConnect";

export async function GET(req: Request) {

  const auth = requireAuth(req); if (auth instanceof Response) return auth;
  if (auth instanceof Response) return auth;

  await dbConnect();

  const notifications = await Notification.find({
    userId: auth.id
  }).sort({ createdAt: -1 });

  return NextResponse.json({
    notifications
  });

}