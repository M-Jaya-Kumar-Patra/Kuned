import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import { verifyToken } from "@/lib/jwt";


type TokenPayload = {
  id: string;
  email: string;
};


export async function PUT(req: Request) {
  try {

    await dbConnect();

    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeee")

    const decoded = verifyToken(token) as TokenPayload | null;

if (!decoded) {
  return NextResponse.json(
    { message: "Invalid token" },
    { status: 401 }
  );
}

const { currentPassword, newPassword } = await req.json();

const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const valid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!valid) {
      return NextResponse.json(
        { message: "Current password incorrect" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    return NextResponse.json({
      message: "Password updated successfully"
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { message: "Failed to update password" },
      { status: 500 }
    );

  }
}