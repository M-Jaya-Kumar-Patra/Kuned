import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function GET() {

  await sendEmail({
    to: "snsteelfabrication010@gmail.com",
    subject: "Test Email",
    html: "<h1>Email system working 🚀</h1>",
  });

  return NextResponse.json({
    success: true,
    message: "Email sent",
  });

}