import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import { createToken } from "@/lib/jwt";
import { generateReferralCode } from "@/lib/generateReferralCode";

// ✅ ADD THESE
import { sendEmail } from "@/lib/email";
import { loginAlertEmail } from "@/lib/emailTemplates/loginAlertEmail";

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

    const email = payload?.email;
    const name = payload?.name || "Google User";
    const picture = payload?.picture || "";

    let user = await User.findOne({ email });

    const refCode = generateReferralCode();

    // 🆕 NEW USER
    if (!user) {
      user = await User.create({
        name,
        email,
        avatar: picture,
        provider: "google",
        password: null,
        referralCode: refCode,
        emailVerified: true,
      });
    }

    // 🔁 EXISTING USER (LOCAL → GOOGLE)
    if (user.provider === "local") {
      user.provider = "google";
      user.avatar = user.avatar || picture;
      user.emailVerified = true;
      await user.save();
    }

    // 🚫 banned check
    if (user.banned) {
      return NextResponse.json(
        { message: "Account banned" },
        { status: 403 }
      );
    }

    // 🔐 JWT
    const token = createToken({
      id: user._id,
      email: user.email,
    });

    // 📩 SEND LOGIN EMAIL (NON-BLOCKING)
    try {
      await sendEmail({
        to: user.email,
        subject: "New Google Login Alert 🔐",
        html: loginAlertEmail(user.name),
      });
    } catch (err) {
      console.error("Email failed but login continues:", err);
    }

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

    let message = "Unknown error";

    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json(
      {
        message: "Google auth failed",
        error: message,
      },
      { status: 500 }
    );
  }
}