"use server";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { toPlainObject } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";

export const getLatestProducts = async () => {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });
  const prisma = new PrismaClient({ adapter });
  const products = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: {
      createdAt: "desc",
    },
  });
  return toPlainObject(products) ;
};
