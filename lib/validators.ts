import { email, z } from "zod";
import { formatNumberWithDecimal } from "./utils";
import { Prisma } from "@prisma/client";

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
  price: z.preprocess((val) => String(val), z.string()),
  rating: z.preprocess((val) => String(val), z.string()),
  numReviews: z.number(),
  createdAt: z
    .union([z.date(), z.string()])
    .transform((val) => (val instanceof Date ? val.toISOString() : val)),
});
// zod schema for sign-in form
export const signInFormSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// zod schema for sign-up form
export const signUpFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters"),
}).refine((data)=> data.password=== data.confirmPassword, {
  message:"Passwords don't match",
  path:['confirmPassword']
});

