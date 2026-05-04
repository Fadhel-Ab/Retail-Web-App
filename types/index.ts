import {
  ProductResponseSchema,
  signInFormSchema,
  cartItemSchema,
  insertCartSchema,
  CartResponseSchema,
  createShippingAddressSchema,
  createPaymentMethodSchema,
} from "@/lib/validators";

import z from "zod";


//const paymentMethodSchema = await createPaymentMethodSchema(locale);
export type ShippingAddress = z.infer<typeof createShippingAddressSchema>;
export type paymentMethod = z.infer<typeof createPaymentMethodSchema>;
export type Product = z.infer<typeof ProductResponseSchema>;
export type FormData = z.infer<typeof signInFormSchema>;
export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type CartResponse = z.infer<typeof CartResponseSchema>;


