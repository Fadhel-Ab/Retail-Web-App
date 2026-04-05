import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import sampleData from "@/db/sample-data";

async function main() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });

  const prisma = new PrismaClient({ adapter });
  await prisma.product.deleteMany();
  await prisma.product.createMany({ data: sampleData.products });

  console.log("database seeded successfully ")
} 
main();
