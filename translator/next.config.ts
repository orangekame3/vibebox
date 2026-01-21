import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/microsoft/fluentui-emoji/**",
      },
    ],
  },
};

export default nextConfig;
