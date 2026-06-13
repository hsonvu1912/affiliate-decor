import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Real product images are served same-origin via /img/[id] (the Drive
    // proxy), so no remotePattern is needed for them. picsum.photos is only
    // used by the mock/demo fixtures.
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
    ],
  },
};

export default nextConfig;
