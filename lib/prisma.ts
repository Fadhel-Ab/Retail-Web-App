import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// 1. Setup WebSockets for Node.js (Next.js server-side)
if (typeof window === "undefined") {
  neonConfig.webSocketConstructor = ws;
}
// 2. Prevent multiple instances of Prisma in development
const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};
// 3. Create the adapter using the config object (fixes the Type Error)
const poolConfig = { connectionString: process.env.DATABASE_URL };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const adapter = new PrismaNeon(poolConfig as any);

// 4. Initialize Prisma
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
export default prisma;
