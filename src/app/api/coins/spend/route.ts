import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";
import { dbConnect } from "@/lib/dbConnect";
import { spendCoins } from "@/utils/coinService";

export async function POST(req: Request) {

  const auth = await requireAuth(req);
  if (auth instanceof Response) return auth;

  await dbConnect();

  const { amount, source } = await req.json();

  try {

    await spendCoins(auth.id, amount, source);

    return NextResponse.json({
      message: "Coins deducted successfully"
    });

  } catch (error: unknown) {

    const message =
      error instanceof Error ? error.message : "Something went wrong";

    return NextResponse.json(
      { message },
      { status: 400 }
    );
  }
}