import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import { requireAuth } from "@/lib/requireAuth";

export async function PUT(req: Request) {
  try {

    await dbConnect();

    const authUser = requireAuth(req);

    const body = await req.json();

    console.log("Incoming body:", authUser.id, body);

    const updatedUser = await User.findOneAndUpdate(
      { _id: authUser.id },
      { $set: body }, // ⭐ update any provided fields
      {
        returnDocument: "after",
        runValidators: true
      }
    );

    console.log("Updated user:", updatedUser);

    return NextResponse.json(updatedUser);

  } catch (error) {

    console.log("Update error:", error);

    return NextResponse.json(
      { message: "Update failed" },
      { status: 500 }
    );

  }
}