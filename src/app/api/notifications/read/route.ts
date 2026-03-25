import { NextResponse } from "next/server";
import Notification from "@/models/Notification";
import { requireAuth } from "@/lib/requireAuth";
import { dbConnect } from "@/lib/dbConnect";

export async function POST(req: Request) {

  const auth = requireAuth(req); if (auth instanceof Response) return auth;

  const user = auth;

  await dbConnect();

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  const filter: Record<string, unknown> = {
    userId: user.id,
    isRead: false
  };

  if (type) {
    filter.type = type;
  }

  await Notification.updateMany(filter, {
    isRead: true
  });

  return NextResponse.json({
    message: "Notifications marked as read"
  });
}