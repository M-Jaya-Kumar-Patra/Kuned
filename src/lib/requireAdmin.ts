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

  if (!authHeader) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  const decoded = verifyToken(token) as TokenPayload | null;

  if (!decoded) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  await dbConnect();

  const user = await User.findById(decoded.id);

  if (!user || !user.isAdmin) {
    return NextResponse.json(
      { message: "Admin access required" },
      { status: 403 }
    );
  }

  return user;
}