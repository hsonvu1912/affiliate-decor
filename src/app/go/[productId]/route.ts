import { NextResponse } from "next/server";
import { after } from "next/server";
import { getProductById } from "@/lib/data/products";
import { deviceFromUA, logClick } from "@/lib/data/clicks";
import type { ClickEvent } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  const { productId } = await params;
  const product = await getProductById(productId);

  // Unknown product or missing link → send home rather than 404 a click.
  if (!product || !product.affiliateUrl) {
    return NextResponse.redirect(new URL("/", req.url), { status: 302 });
  }

  const ua = req.headers.get("user-agent") ?? "";
  const event: ClickEvent = {
    timestamp: new Date().toISOString(),
    productId: product.id,
    productName: product.name,
    retailer: product.retailer,
    affiliateUrl: product.affiliateUrl,
    referrer: req.headers.get("referer") ?? "",
    country: req.headers.get("x-vercel-ip-country") ?? "",
    device: deviceFromUA(ua),
    userAgent: ua,
  };

  // Log AFTER the response is sent so the redirect is never blocked by the
  // Sheets append latency. Failures are swallowed — tracking must never break
  // the outbound click.
  after(async () => {
    try {
      await logClick(event);
    } catch (err) {
      console.error("Lỗi ghi click:", err);
    }
  });

  const res = NextResponse.redirect(product.affiliateUrl, { status: 302 });
  res.headers.set("Cache-Control", "no-store");
  return res;
}
