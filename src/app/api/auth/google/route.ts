import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import { createToken } from "@/lib/jwt";
import { generateReferralCode } from "@/lib/generateReferralCode";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { credential } = await req.json();

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    console.log("Payload:", payload);
    
    const email = payload?.email;
const name = payload?.name || "Google User";
const picture = payload?.picture || "";

    let user = await User.findOne({ email });

    const refCode = generateReferralCode()

    console.log("User found:", user);
    // 🆕 NEW USER
    if (!user) {
      user = await User.create({
        name,
        email,
        avatar: picture,
        provider: "google",
        password: null,
        referralCode: refCode,
        emailVerified: true, // 🔥 already verified by Google
      });
    }

    // 🔁 EXISTING USER (LOCAL → GOOGLE)
    if (user.provider === "local") {
      user.provider = "google";
      user.avatar = user.avatar || picture;
      user.emailVerified = true;
      await user.save();
    }

    if (user.banned) {
      return NextResponse.json(
        { message: "Account banned" },
        { status: 403 }
      );
    }

    // 🔐 SAME JWT SYSTEM
    const token = createToken({
      id: user._id,
      email: user.email,
    });

    return NextResponse.json({
      message: "Google login successful",
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
  console.log("🔥 GOOGLE ERROR:", error);
  return NextResponse.json(
    { message: "Google auth failed", error: error.message },
    { status: 500 }
  );
}
}