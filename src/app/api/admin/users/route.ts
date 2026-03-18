import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";

export async function GET(req: Request) {

  const admin = await requireAdmin(req);
  if (admin instanceof Response) return admin;

  await dbConnect();

  const users = await User.find().sort({ createdAt: -1 });

  return NextResponse.json(users);
}