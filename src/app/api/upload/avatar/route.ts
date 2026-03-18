import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { requireAuth } from "@/lib/requireAuth";
import User from "@/models/User";

export async function POST(req: Request) {

  try {

    await dbConnect();

    const user = requireAuth(req); if (user instanceof Response) return user;

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }


    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      { avatar: imageUrl },
      { new: true }
    ).select("name email avatar bonusCoins paidCoins referralCode");

    return NextResponse.json(updatedUser);

  } catch (error) {

    return NextResponse.json(
      { message: "Upload failed", error },
      { status: 500 }
    );

  }

}