import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Listing from "@/models/Listing";
import User from "@/models/User";
import { generateSlug } from "@/lib/generateSlug";
import { requireAuth } from "@/lib/requireAuth";
import { spendCoins } from "@/utils/coinService";
import { COIN_COST } from "@/constants/coins";


type Specification = {
  key: string;
  value: string;
};
type CreateListingBody = {
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  images: string[];
  specifications?: Specification[];
  condition: "new" | "used" | "refurbished"; // ✅ added
};

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

    const body: CreateListingBody = await req.json();

const {
  title,
  description,
  price,
  category,
  location,
  images,
  specifications,
  condition,
} = body;



    if (!title || !description || price == null || !category || !condition || !location) {
       return NextResponse.json(
    { message: "All required fields, including condition, must be provided." },
    { status: 400 }
  );
    }

    


    const slug = generateSlug(title, location);

    // spend coins BEFORE creating listing
    await spendCoins(user.id, COIN_COST.POST_LISTING, "post_listing");


    const cleanSpecs = (specifications || []).filter(
  (s: Specification) => s.key?.trim() && s.value?.trim()
);

    const listing = await Listing.create({
      title,
      description,
      price,
      category,
      location,
      images,
      condition,
      sellerId: user.id,
      slug,
      specifications: cleanSpecs
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