import { NextResponse } from "next/server";
import { fetchDriveFile } from "@/lib/google/drive";

// Proxy + cache Google Drive images behind a stable same-origin URL.
// Drive file IDs are immutable, so caching aggressively is safe; swapping an
// image means changing the ID in the sheet (a new URL).
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) return new NextResponse("Missing id", { status: 400 });

  try {
    const { buffer, contentType } = await fetchDriveFile(id);
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    console.error("Lỗi tải ảnh Drive:", id, err);
    return new NextResponse("Không tải được ảnh", { status: 502 });
  }
}
