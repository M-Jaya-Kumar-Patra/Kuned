import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { requireAuth } from "@/lib/requireAuth";
import Report from "@/models/Report";
import User from "@/models/User";

export async function GET(req: Request) {

  const auth = requireAuth(req);
  if (auth instanceof Response) return auth;

  await dbConnect();

  const user = await User.findById(auth.id);

  if (!user?.isAdmin) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 403 }
    );
  }

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
