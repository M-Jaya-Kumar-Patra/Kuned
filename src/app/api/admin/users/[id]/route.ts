import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import { requireAuth } from "@/lib/requireAuth";
import { requireAdmin } from "@/lib/requireAdmin";
import { Truculenta } from "next/font/google";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {

  const admin = await requireAdmin(req);
if (admin instanceof Response) return admin;

  await dbConnect();

  const { id } = await context.params;

  console.log("Banning user:", id);

  const user = await User.findById(id);

if (!user) {
  return NextResponse.json(
    { message: "User not found" },
    { status: 404 }
  );
}

user.banned = true;

await user.save();

console.log("Updated user:", user);


  if (!user) {
    return NextResponse.json(
      { message: "User not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: "User banned",
    user
  });

}