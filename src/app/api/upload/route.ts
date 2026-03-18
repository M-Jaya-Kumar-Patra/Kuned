import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { UploadApiResponse } from "cloudinary";

export async function POST(req: Request) {

  try {

    const data = await req.formData();
    const file = data.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResponse = await new Promise<UploadApiResponse>((resolve, reject) => {

      cloudinary.uploader.upload_stream(
        { folder: "Kuned" },
        (error, result) => {

          if (error) reject(error);
          else resolve(result as UploadApiResponse);

        }
      ).end(buffer);

    });

    return NextResponse.json({
      secure_url: uploadResponse.secure_url
    });

  } catch (err) {

    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );

  }

}