import { Decimal } from "@/lib/generated/prisma/internal/prismaNamespace";
import { insertProductSchema, ProductResponseSchema ,  } from "@/lib/validators";
import z from "zod";

export type Product = z.infer<typeof ProductResponseSchema> 