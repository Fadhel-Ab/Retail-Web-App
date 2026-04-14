"use server";
import prisma from "@/lib/prisma";
import { ProductResponseSchema } from "../validators";

import { LATEST_PRODUCTS_LIMIT } from "../constants";
import { z } from "zod";

export const getLatestProducts = async () => {
  const products = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: {
      createdAt: "desc",
    },
  });

  return z.array(ProductResponseSchema).parse(products);
};

export const getProductBySlug = async (slug: string) => {
  const response = await prisma.product.findFirst({
    where: { slug: slug },
  });

  return ProductResponseSchema.parse(response);
};
