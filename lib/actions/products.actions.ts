"use server";
import { PrismaClient } from "../generated/prisma/client";
import { ProductResponseSchema } from "../validators";
import { PrismaPg } from "@prisma/adapter-pg";
import { toPlainObject } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";
import { z } from "zod";


const adapter = new PrismaPg({ // default adapter
    connectionString: process.env.DATABASE_URL,
  });
  const prisma = new PrismaClient({ adapter }); // default adapter

export const getLatestProducts = async () => {
  const products = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: {
      createdAt: "desc",
    },
  });

  return z.array(ProductResponseSchema).parse(products);
};

export const  getProductBySlug = async (slug: string) => {
  const response= await prisma.product.findFirst({
    where: {slug: slug},
  });

return ProductResponseSchema.parse(response);
}
