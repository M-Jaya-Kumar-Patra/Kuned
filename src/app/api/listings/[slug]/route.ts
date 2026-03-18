import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import Listing from "@/models/Listing";
import { requireAuth } from "@/lib/requireAuth";


// ⭐ force mongoose to register the model
User;


export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {

    const { slug } = await params;

    await dbConnect();

    const listing = await Listing.findOne({ slug })
      .populate("sellerId", "name email banned"); // include banned field


      await Listing.findByIdAndUpdate(
  listing._id,
  { $inc: { views: 1 } }
);


    if (!listing) {
      return NextResponse.json(
        { message: "Listing not found" },
        { status: 404 }
      );
    }

    // 🚫 hide listings of banned users
    if (listing.sellerId?.banned) {
      return NextResponse.json(
        { message: "Listing not available" },
        { status: 404 }
      );
    }

    return NextResponse.json(listing);

  } catch (error) {

    console.error("GET LISTING ERROR:", error);

    return NextResponse.json(
      { message: "Failed to fetch listing", error },
      { status: 500 }
    );

  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {

  const { slug } = await params;


  const auth = requireAuth(req);
  if (auth instanceof Response) return auth;

  const user = auth as { id: string };

  await dbConnect();

  const listing = await Listing.findById(slug);

  if (!listing) {
    return NextResponse.json(
      { message: "Listing not found" },
      { status: 404 }
    );
  }

  if (listing.sellerId.toString() !== user.id) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 403 }
    );
  }

  await Listing.findByIdAndDelete(slug);

  return NextResponse.json({
    message: "Listing deleted"
  });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {

  const { slug } = await params;

  const auth = requireAuth(req);
  if (auth instanceof Response) return auth;

  const user = auth as { id: string };

  await dbConnect();

  const body = await req.json();

  const listing = await Listing.findOne({
    slug
  });

  if (!listing) {
    return NextResponse.json(
      { message: "Listing not found" },
      { status: 404 }
    );
  }

  if (listing.sellerId.toString() !== user.id) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 403 }
    );
  }

  const updated = await Listing.findByIdAndUpdate(
    listing._id,
    body,
    { new: true }
  );

  return NextResponse.json(updated);
}