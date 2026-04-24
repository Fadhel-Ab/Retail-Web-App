import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PrismaClient } from "./generated/prisma/internal/class";
import prisma from "./prisma";
import { Prisma } from "@prisma/client";

// override tailwind default styles with custom ones
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// convert prisma object to regular object
export function toPlainObject<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// format number with decimal places
export function formatNumberWithDecimal(num: string): string {
  const [int, decimal] = num.split(".");
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any) {
  // Zod
  if (error?.name === "ZodError") {
    const flattened = error.flatten();

    const fieldErrors = Object.keys(flattened.fieldErrors).map(
      (field) => flattened.fieldErrors[field]?.[0],
    );

    return fieldErrors.join(". ");
  }

  // Prisma unique constraint
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      const target = error?.meta?.target;

      // Driver adapter path (e.g. Neon, PlanetScale, libSQL)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const driverFields = (error?.meta as any)?.driverAdapterError?.cause
        ?.constraint?.fields;

      const field = "field";

      return `${(driverFields[0] ?? field).charAt(0).toUpperCase() + (driverFields[0] ?? field).slice(1)} already exists.`;
    }
  }

  return error?.message || "Unknown error occurred.";
}
