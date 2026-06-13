import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { timingSafeEqual } from "node:crypto";
import { env } from "@/lib/env";
import { TAGS } from "@/lib/data/cache";

export const dynamic = "force-dynamic";

// Maps a Sheet tab name to the cache tags to bust. `all` is always busted too
// because products/collections/categories cross-reference each other.
const TAB_TAGS: Record<string, string[]> = {
  Products: [TAGS.products],
  Collections: [TAGS.collections],
  Categories: [TAGS.categories],
  Styles: [TAGS.styles],
  Settings: [TAGS.settings],
};

function secretsMatch(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export async function POST(req: Request) {
  if (!env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Chưa cấu hình REVALIDATE_SECRET" }, { status: 500 });
  }

  let body: { secret?: string; sheet?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body không hợp lệ" }, { status: 400 });
  }

  if (!body.secret || !secretsMatch(body.secret, env.REVALIDATE_SECRET)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tags = (body.sheet && TAB_TAGS[body.sheet]) || [];
  // Next 16 requires a cache-life profile; "max" fully invalidates the tag.
  for (const tag of tags) revalidateTag(tag, "max");
  revalidateTag(TAGS.all, "max");

  return NextResponse.json({
    revalidated: true,
    sheet: body.sheet ?? null,
    tags: [...tags, TAGS.all],
    now: Date.now(),
  });
}
