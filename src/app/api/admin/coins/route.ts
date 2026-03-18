import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(req: Request) {

  const admin = await requireAdmin(req);
  if (admin instanceof Response) return admin;

  const { userId, coins } = await req.json();

  await dbConnect();

  const user = await User.findById(userId);

  user.paidCoins += coins;

  await user.save();

  return NextResponse.json({ message: "Coins updated" });
}