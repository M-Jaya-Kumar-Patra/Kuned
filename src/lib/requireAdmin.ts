import { NextResponse } from "next/server";
import { verifyToken } from "./jwt";
import User from "@/models/User";
import { dbConnect } from "./dbConnect";

type TokenPayload = {
  id: string;
  email?: string;
};

export async function requireAdmin(req: Request) {
  const authHeader = req.headers.get("authorization");

  // ❌ No token → 404
  if (!authHeader) {
    return NextResponse.json({ message: "Not Found" }, { status: 404 });
  }

  const token = authHeader.split(" ")[1];

  const decoded = verifyToken(token) as TokenPayload | null;

  // ❌ Invalid token → 404
  if (!decoded) {
    return NextResponse.json({ message: "Not Found" }, { status: 404 });
  }

  await dbConnect();

  const user = await User.findById(decoded.id);

  // ❌ Not admin → 404
  if (!user || !user.isAdmin) {
    return NextResponse.json({ message: "Not Found" }, { status: 404 });
  }

  // ✅ Admin → allow
  return user;
}