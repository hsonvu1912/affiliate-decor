import type { NextConfig } from "next";

// Static export mode (GitHub Pages demo): set STATIC_EXPORT=true. The site is
// exported to ./out with mock data; the repo name becomes the basePath so URLs
// resolve under https://<user>.github.io/<repo>/.
const isStaticExport = process.env.STATIC_EXPORT === "true";
const repoBasePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = isStaticExport
  ? {
      output: "export",
      basePath: repoBasePath || undefined,
      assetPrefix: repoBasePath ? `${repoBasePath}/` : undefined,
      trailingSlash: true,
      images: { unoptimized: true },
    }
  : {
      images: {
        // Real product images are served same-origin via /img/[id] (the Drive
        // proxy). picsum.photos is only used by the mock/demo fixtures.
        remotePatterns: [
          { protocol: "https", hostname: "picsum.photos" },
          { protocol: "https", hostname: "fastly.picsum.photos" },
        ],
      },
    };

export default nextConfig;
