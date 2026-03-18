import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";
import { dbConnect } from "@/lib/dbConnect";
import Report from "@/models/Report";

export async function GET(req: Request) {

  const auth = requireAuth(req);
  if (auth instanceof Response) return auth;

  await dbConnect();

  const reports = await Report.find({
    reporterId: auth.id
  })
  .sort({ createdAt: -1 })
  .lean();

  return NextResponse.json(reports);

}