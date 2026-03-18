import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Listing from "@/models/Listing";
import mongoose from "mongoose";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {

  try {

    await dbConnect();

    const { id } = await context.params;

    const listing = await Listing.findById(id);

    if (!listing) {
      return NextResponse.json(
        { message: "Listing not found" },
        { status: 404 }
      );
    }

    const similarListings = await Listing.aggregate([
      {
        $match: {
          category: listing.category,
          _id: { $ne: new mongoose.Types.ObjectId(id) }
        }
      },
      {
        $sample: { size: 12 }
      }
    ]);

    // 🔹 populate seller
    const populatedListings = await Listing.populate(similarListings, {
      path: "sellerId",
      match: { banned: false },
      select: "name banned"
    });

    // 🔹 remove banned sellers
    const filteredListings = populatedListings.filter(
      (l) => l.sellerId
    );

    return NextResponse.json(filteredListings);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { message: "Failed to fetch similar listings" },
      { status: 500 }
    );

  }

}