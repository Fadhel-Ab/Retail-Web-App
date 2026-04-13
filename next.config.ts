import type { NextConfig } from "next";
import { withIntlayer } from "next-intlayer/server";

const nextConfig: NextConfig = {
 
  // Tells Next.js to skip bundling these packages and use Node's native resolution
  serverExternalPackages: ["@prisma/client", "pg"],
};

export default withIntlayer(nextConfig);
