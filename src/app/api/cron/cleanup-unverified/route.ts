import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";

export async function GET() {
  try {

    await dbConnect();

    const result = await User.deleteMany({
      emailVerified: false,
      createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    return NextResponse.json({
      message: "Cleanup completed",
      deletedUsers: result.deletedCount
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { message: "Cleanup failed" },
      { status: 500 }
    );

  }
}