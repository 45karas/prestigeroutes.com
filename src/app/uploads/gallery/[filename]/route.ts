import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const contentTypes: Record<string, string> = {
  gif: "image/gif",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

function galleryUploadDir() {
  return path.join(process.env.UPLOAD_DIR || path.join(process.cwd(), "public", "uploads"), "gallery");
}

export async function GET(_request: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;
  const safeFilename = path.basename(filename);

  if (safeFilename !== filename) {
    return new NextResponse("Not found", { status: 404 });
  }

  const extension = safeFilename.split(".").pop()?.toLowerCase() || "";
  const contentType = contentTypes[extension];

  if (!contentType) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const file = await readFile(path.join(galleryUploadDir(), safeFilename));
    return new NextResponse(file, {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Type": contentType,
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
