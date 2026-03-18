import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(req: Request) {

  const auth = requireAuth(req);

  if (auth instanceof Response) return auth;

  const { name } = await req.json();

  await dbConnect();

  const user = await User.findByIdAndUpdate(
    auth.id,
    { name },
    { new: true }
  ).select("-password");

  return NextResponse.json(user);
}