import { verifyToken } from "./jwt";
import { NextResponse } from "next/server";

type AuthUser = {
  id: string;
  email?: string;
  phone?: number;
};

export function requireAuth(req: Request): AuthUser | NextResponse {

  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  try {

    const decoded = verifyToken(token) as AuthUser | null;

    if (!decoded) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }

    return decoded;

  } catch (error) {

    return NextResponse.json(
      { message: "Token expired" },
      { status: 401 }
    );

  }
}