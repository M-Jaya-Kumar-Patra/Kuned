import { NextResponse } from "next/server";
import crypto from "crypto";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import { sendEmail } from "@/lib/email";
import { resetPasswordEmail } from "@/lib/emailTemplates/resetPasswordEmail";



export async function POST(req: Request) {

  await dbConnect();

  const { email } = await req.json();

  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json(
      { message: "User not found" },
      { status: 404 }
    );
  }

  const token = crypto.randomBytes(32).toString("hex");

  user.passwordResetToken = token;
  user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min

  await user.save();

  const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?token=${token}`;

  await sendEmail({
  to: user.email,
  subject: "Reset your password",
  html: resetPasswordEmail(resetUrl)
});

  return NextResponse.json({ success: true });
}