import { Decimal } from "@/lib/generated/prisma/internal/prismaNamespace";
import { insertProductSchema } from "@/lib/validators";
import z from "zod";

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: Decimal;
  createdAt: Date;
};
