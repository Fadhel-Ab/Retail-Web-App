import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import { Pool } from "@neondatabase/serverless";
import ws from "ws";

//this is for serverless prisma adapter neon, it is used to connect to the database using websockets.

// 1. Setup WebSockets for Node.js (Next.js server-side)
if (typeof window === "undefined") {
  neonConfig.webSocketConstructor = ws;
}
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};
// 2. Updated Initialization (The v7 way)
const connectionString = process.env.DATABASE_URL!;

// STOP using 'new Pool()' here.
// Pass the connection string directly to PrismaNeon.
const adapter = connectionString.includes("neon.tech")
  ? new PrismaNeon({ connectionString })
  : new PrismaPg(new Pool({ connectionString }));


// 3. Initialize Prisma (No 'any' cast needed now!)
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
