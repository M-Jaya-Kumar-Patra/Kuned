import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import { sendEmail } from "@/lib/email";
import { loginAlertEmail } from "@/lib/emailTemplates/loginAlertEmail";
import { createToken } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { email, password } = await req.json();

    // 🔍 Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 🚫 Check banned user
    if (user.banned) {
      return NextResponse.json(
        { message: "Your account has been banned" },
        { status: 403 }
      );
    }

    // 🚫 Prevent password login for Google users
    if (user.provider === "google") {
      return NextResponse.json(
        { message: "Please login using Google" },
        { status: 400 }
      );
    }

    // 🔐 Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 📧 Check email verification
    if (!user.emailVerified) {
      return NextResponse.json(
        {
          message: "Email not verified",
          emailVerificationRequired: true,
          email: user.email,
        },
        { status: 403 }
      );
    }

    // 🎟 Generate JWT
    const token = createToken({
      id: user._id,
      email: user.email,
    });

    // 📩 Send login alert (non-blocking)
    try {
      await sendEmail({
        to: user.email,
        subject: "New Login Alert 🔐",
        html: loginAlertEmail(user.name),
      });
    } catch (err) {
      console.error("Email failed but login continues:", err);
    }

    const response = NextResponse.json({
  message: "Login successful",
  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    bonusCoins: user.bonusCoins,
    paidCoins: user.paidCoins,
    referralCode: user.referralCode,
    isAdmin: user.isAdmin,
  },
});

// 🔥 SET COOKIE HERE
response.cookies.set("token", token, {
  httpOnly: true,
  secure: false,        // ❗ VERY IMPORTANT (localhost)
  sameSite: "lax",      // ❗ IMPORTANT
  path: "/",
});

return response;

  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      { message: "Login failed" },
      { status: 500 }
    );
  }
}