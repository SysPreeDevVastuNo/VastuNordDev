import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Mock Studio imagery (lib/mock) is served from the prototype's Sanity
    // dataset until our own storage exists.
    remotePatterns: [new URL("https://cdn.sanity.io/images/5mo9wf71/production/**")],
  },
};

export default nextConfig;
