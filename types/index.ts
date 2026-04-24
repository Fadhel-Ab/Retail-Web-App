
import { ProductResponseSchema, signInFormSchema ,  } from "@/lib/validators";
import z from "zod";

export type Product = z.infer<typeof ProductResponseSchema> 
export type FormData = z.infer<typeof signInFormSchema>;