import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";

import { generateReferralCode } from "@/lib/generateReferralCode";
import { rewardReferral } from "@/lib/referralReward";

import { rateLimiter } from "@/lib/rateLimiter";
import { earnCoins } from "@/utils/coinService";
import { welcomeEmail } from "@/lib/emailTemplates/welcomeEmail";
import { sendEmail } from "@/lib/email";
import { generatePin } from "@/lib/generatePin";
import { verifyEmail } from "@/lib/emailTemplates/verifyEmail";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";

    if (!rateLimiter(ip)) {
      return NextResponse.json(
        { message: "Too many requests" },
        { status: 429 },
      );
    }

    
    await dbConnect();
    
    const { name, email, password, referralCode, sourceWebsite } =
    await req.json();
    
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 },
      );
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newReferralCode = generateReferralCode();
    
    let referredUser = null;
    
    // find referrer user
    if (referralCode) {
      referredUser = await User.findOne({ referralCode });
      
      if (!referredUser) {
        return NextResponse.json(
          { message: "Invalid referral code" },
          { status: 400 },
        );
      }
    }
    
    const verificationPin = generatePin();

    const verificationPinExpires = new Date(Date.now() + 10 * 60 * 1000);

    // create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      referralCode: newReferralCode,
      referredBy: referredUser ? referredUser._id : null,
      sourceWebsite: sourceWebsite || null,
      verificationPin,
      verificationPinExpires,
      emailVerified: false,
      banned: false,
    });

    // reward referrer
    if (referredUser) {
      await earnCoins(
        referredUser._id.toString(),
        10,
        "bonus",
        "referral_bonus",
      );
    }

    await sendEmail({
  to: user.email,
  subject: "Verify your email",
  html: verifyEmail(user.name, verificationPin)
});

    return NextResponse.json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Signup failed", error },
      { status: 500 },
    );
  }
}
