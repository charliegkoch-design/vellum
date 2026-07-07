import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3"],
  // bundle the build-time seeded database into the serverless functions
  outputFileTracingIncludes: {
    "/**/*": [".data/vellum.db"],
  },
};

export default nextConfig;
