import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import { sendEmail } from "@/lib/email";
import { passwordChangedEmail } from "@/lib/emailTemplates/passwordChangedEmail";


export async function POST(req: Request) {

  await dbConnect();

  const { token, password } = await req.json();

  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: new Date() },
  });

  if (!user) {
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user.password = hashedPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  await sendEmail({
  to: user.email,
  subject: "Password Changed Successfully",
  html: passwordChangedEmail(user.name)
});

  return NextResponse.json({ success: true });
}