
import { ProductResponseSchema, signInFormSchema ,cartItemSchema, insertCartSchema, CartResponseSchema,   } from "@/lib/validators";
import { Car } from "lucide-react";
import z from "zod";

export type Product = z.infer<typeof ProductResponseSchema> 
export type FormData = z.infer<typeof signInFormSchema>;
export type Cart=z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type CartResponse = z.infer<typeof CartResponseSchema>;
