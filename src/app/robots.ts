import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const base = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Don't crawl outbound tracking redirects.
      disallow: ["/go/", "/api/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
