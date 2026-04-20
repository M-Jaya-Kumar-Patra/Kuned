import { verifyToken } from "./jwt";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

type AuthUser = {
  id: string;
  email?: string;
  phone?: number;
};

export async function requireAuth(): Promise<AuthUser | NextResponse> {

  // 🔥 FIXED
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  console.log("AUTH TOKEN:", token);

  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

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