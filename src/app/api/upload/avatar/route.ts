import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { requireAuth } from "@/lib/requireAuth";
import User from "@/models/User";
import cloudinary from "@/lib/cloudinary"; // 👈 import this

export async function POST(req: Request) {
  try {
    await dbConnect();

    const user = requireAuth(req);
    if (user instanceof Response) return user;

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }

    // 🔥 convert file → buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 🔥 upload to cloudinary
    const uploadRes = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "kuned" },
        (error, result) => {
          if (error) reject(error);
          else resolve({ secure_url: result?.secure_url || "" });
        }
      );

      stream.end(buffer);
    });

    const imageUrl = uploadRes.secure_url;

    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      { avatar: imageUrl },
      { new: true }
    ).select("name email avatar bonusCoins paidCoins referralCode");

    return NextResponse.json(updatedUser);

  } catch (error) {

    const message =
      error instanceof Error ? error.message : "Upload failed";

    return NextResponse.json(
      { message },
      { status: 500 }
    );

  }
}