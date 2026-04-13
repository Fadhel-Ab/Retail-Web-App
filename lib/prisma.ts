import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// 1. Setup WebSockets for Node.js (Next.js server-side)
if (typeof window === "undefined") {
  neonConfig.webSocketConstructor = ws;
}

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// 2. Initialize the Adapter directly with the connection string
// Passing the string inside an object { connectionString } fixes the Pool type error.
const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});

// 3. Initialize Prisma
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
