import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Listing from "@/models/Listing";
import { requireAuth } from "@/lib/requireAuth";
import User from "@/models/User";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {

  const auth = await requireAuth(); if (auth instanceof Response) return auth;

  await dbConnect();

  const user = await User.findById(auth.id);

  if (!user?.isAdmin) {
    return NextResponse.json(
      { message: "Forbidden" },
      { status: 403 }
    );
  }

  const { id } = await context.params;

  await Listing.findByIdAndDelete(id);

  return NextResponse.json({
    message: "Listing deleted"
  });

}
