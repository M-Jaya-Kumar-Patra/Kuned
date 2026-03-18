import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(req: Request) {

  await dbConnect();

  const { email, pin } = await req.json();

  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json(
      { message: "User not found" },
      { status: 404 }
    );
  }

  
  if (user.verificationPin !== pin) {
    return NextResponse.json(
      { message: "Invalid PIN" },
      { status: 400 }
    );
}
  if (user.verificationPinExpires < new Date()) {
    return NextResponse.json(
      { message: "PIN expired" },
      { status: 400 }
    );
  }


  user.emailVerified = true;
  user.verificationPin = null;
  user.verificationPinExpires = null;

  await user.save();

  return NextResponse.json({
    message: "Email verified successfully"
  });

}