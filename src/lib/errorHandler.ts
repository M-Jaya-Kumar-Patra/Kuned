import { NextResponse } from "next/server";
import { AppError } from "./AppError";

export function handleError(error: unknown) {

  if (error instanceof AppError) {

    return NextResponse.json(
      { message: error.message },
      { status: error.statusCode }
    );

  }

  console.error("SERVER ERROR:", error);

  return NextResponse.json(
    { message: "Internal server error" },
    { status: 500 }
  );
}