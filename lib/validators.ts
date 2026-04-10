import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";
import { Prisma } from "./generated/prisma/browser";

// zod schema for inserting product
const arabicRegex = /^[\u0600-\u06FF\s]+$/;
const priceRegex = /^\d+(.\d{2})?$/;
const currency = z
  .string()
  .refine((val) => priceRegex.test(formatNumberWithDecimal(val)), {
    message: "Price must have exactly 2 decimal places ",
  })
  .transform((val) => new Prisma.Decimal(val));

export const insertProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  nameAr: z
    .string()
    .regex(arabicRegex, {
      message: "Arabic Name Must contain only Arabic characters",
    })
    .min(3, "Arabic Name Must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  category: z.string().min(3, "Category must be at least 3 characters"),
  categoryAr: z
    .string()
    .regex(arabicRegex, {
      message: "Arabic Category Must contain only Arabic characters",
    })
    .min(3, "Arabic Category Must be at least 3 characters"),
  brand: z.string().min(3, "Brand must be at least 3 characters "),
  brandAr: z
    .string()
    .regex(arabicRegex, {
      message: "Arabic Brand Must contain only Arabic characters",
    })
    .min(3, "Arabic Brand Must be at least 3 characters"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  descriptionAr: z
    .string()
    .regex(arabicRegex, {
      message: "Arabic Description Must contain only Arabic characters",
    })
    .min(3, "Arabic Description Must be at least 3 characters"),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, "Product must have at least one image"),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
});

export const ProductResponseSchema = z.object({
  id: z.string(),
  nameAr: z.string(),
  name: z.string(),
  slug: z.string(),
  category: z.string(),
  categoryAr: z.string(),
  brand: z.string(),
  brandAr: z.string(),
  description: z.string(),
  descriptionAr: z.string(),
  stock: z.number(),
  images: z.array(z.string()),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: z
  .preprocess((val) => String(val), z.string()), 
  rating: z
  .preprocess((val) => String(val), z.string()), 
  numReviews: z.number(),
  createdAt: z
    .union([z.date(), z.string()])
    .transform((val) => (val instanceof Date ? val.toISOString() : val)),
});
