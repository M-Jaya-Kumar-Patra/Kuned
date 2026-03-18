import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Listing from "@/models/Listing";
import User from "@/models/User";
import { generateSlug } from "@/lib/generateSlug";
import { requireAuth } from "@/lib/requireAuth";
import { spendCoins } from "@/utils/coinService";
import { COIN_COST } from "@/constants/coins";

export async function POST(req: Request) {

  try {

    const auth = requireAuth(req);
    if (auth instanceof Response) return auth;

    const user = auth as { id: string };

    await dbConnect();

    // 🚫 BLOCK banned users
    const dbUser = await User.findById(user.id);

    if (dbUser?.banned) {
      return NextResponse.json(
        { message: "Your account is banned. You cannot create listings." },
        { status: 403 }
      );
    }

    const body = await req.json();

    const {
      title,
      description,
      price,
      category,
      location,
      images
    } = body;

    if (!title || !description || !price || !category || !location) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const slug = generateSlug(title, location);

    // spend coins BEFORE creating listing
    await spendCoins(user.id, COIN_COST.POST_LISTING, "post_listing");

    const listing = await Listing.create({
      title,
      description,
      price,
      category,
      location,
      images,
      sellerId: user.id,
      slug
    });

    return NextResponse.json({
      message: "Listing created",
      listing
    });

  } catch (error) {

    console.error("CREATE LISTING ERROR:", error);

    return NextResponse.json(
      { message: "Listing creation failed" },
      { status: 500 }
    );

  }
}