import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import { generatePin } from "@/lib/generatePin";
import { sendEmail } from "@/lib/email";
import { verifyEmail } from "@/lib/emailTemplates/verifyEmail";

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

  if (user.emailVerified) {
  return NextResponse.json(
    { message: "Email already verified" },
    { status: 400 }
  );
}

  const newPin = generatePin();

  user.verificationPin = newPin;
  user.verificationPinExpires = new Date(
    Date.now() + 10 * 60 * 1000
  );

  await user.save();

  await sendEmail({
    to: user.email,
    subject: "Your verification PIN",
    html: verifyEmail(user.name, newPin)
  });

  return NextResponse.json({
    message: "PIN resent"
  });

}