import { NextResponse } from "next/server";
import Listing from "@/models/Listing";
import {dbConnect} from "@/lib/dbConnect";
// src/app/api/listings/by-ids/route.ts
import mongoose from "mongoose";

export async function POST(req: Request) {
  await dbConnect();

  let body;

  try {
    body = await req.json();
  } catch {
    return Response.json([], { status: 200 });
  }

  const ids = body?.ids;

  if (!Array.isArray(ids) || ids.length === 0) {
    return Response.json([], { status: 200 });
  }

  const objectIds = ids.map((id: string) => new mongoose.Types.ObjectId(id));

  const listings = await Listing.find({
    _id: { $in: objectIds },
  });

  return Response.json(listings);
}