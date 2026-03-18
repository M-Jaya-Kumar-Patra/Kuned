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

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );
    }

    if (user.banned) {
      return NextResponse.json(
        { message: "Your account has been banned" },
        { status: 403 },
      );
    }

    if (user.provider === "google") {
  return NextResponse.json(
    { message: "Please login using Google" },
    { status: 400 }
  );
}


    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );
    }

    if (!user.emailVerified) {
      return NextResponse.json(
        {
          message: "Email not verified",
          emailVerificationRequired: true,
          email: user.email,
        },
        { status: 403 },
      );
    }

    const token = createToken({
      id: user._id,
      email: user.email,
    });

    await sendEmail({
      to: user.email,
      subject: "New Login Alert",
      html: loginAlertEmail(user.name),
    });

    return NextResponse.json({
      message: "Login successful",
      token,
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
  } catch (error) {
    return NextResponse.json(
      { message: "Login failed", error },
      { status: 500 },
    );
  }
}
