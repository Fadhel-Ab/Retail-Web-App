import { getLocale } from "next-intlayer/server";
import { Prisma } from "@prisma/client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function formatError(error: any) {
  const locale = await getLocale();
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

      return locale === "en"
        ? `${(driverFields[0] ?? field).charAt(0).toUpperCase() + (driverFields[0] ?? field).slice(1)} already exists.`
        : `البريد الإلكتروني موجود بالفعل`;
    }
  }

  return error?.message || "Unknown error occurred.";
}
