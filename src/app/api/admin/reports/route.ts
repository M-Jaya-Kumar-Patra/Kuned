import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { requireAdmin } from "@/lib/requireAdmin"; // ✅ use this
import Report from "@/models/Report";

export async function GET(req: Request) {

  const admin = await requireAdmin(req);

  // 🔥 THIS IS THE KEY LINE
  if (admin instanceof Response) return admin;

  await dbConnect();

  const reports = await Report.find()
    .populate("reporterId", "_id name email")
    .populate({
      path: "targetId",
      model: "Listing",
      populate: {
        path: "sellerId",
        model: "User",
        select: "_id name email banned"
      }
    })
    .sort({ createdAt: -1 });

  return NextResponse.json(reports);
}