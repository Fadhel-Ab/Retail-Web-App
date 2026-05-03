
import { ProductResponseSchema, signInFormSchema ,cartItemSchema, insertCartSchema, CartResponseSchema, createShippingAddressSchema, createPaymentMethodSchema  } from "@/lib/validators";

import { getLocale } from "next-intlayer/server";
import z from "zod";
const locale= await  getLocale();
const ShippingAddressSchema= await createShippingAddressSchema(locale);
const paymentMethodSchema = await createPaymentMethodSchema(locale);

export type Product = z.infer<typeof ProductResponseSchema> 
export type FormData = z.infer<typeof signInFormSchema>;
export type Cart=z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type CartResponse = z.infer<typeof CartResponseSchema>;
export type ShippingAddress=z.infer<typeof ShippingAddressSchema>;
export type paymentMethod=z.infer<typeof createPaymentMethodSchema>;
