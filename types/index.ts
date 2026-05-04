import {
  ProductResponseSchema,
  signInFormSchema,
  cartItemSchema,
  insertCartSchema,
  CartResponseSchema,
  createShippingAddressSchema,
  createPaymentMethodSchema,
  createInsertOrderItemSchema,
  createInsertOrderSchema,
} from "@/lib/validators";

import z from "zod";

//const paymentMethodSchema = await createPaymentMethodSchema(locale);
export type ShippingAddress = z.infer<ReturnType<typeof createShippingAddressSchema>>;
export type paymentMethod = z.infer<ReturnType<typeof createPaymentMethodSchema>>;
export type Product = z.infer<typeof ProductResponseSchema>;
export type FormData = z.infer<typeof signInFormSchema>;
export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type CartResponse = z.infer<typeof CartResponseSchema>;
export type OrderItem = z.infer<ReturnType<typeof createInsertOrderItemSchema>>;
export type Order = z.infer<ReturnType<typeof createInsertOrderSchema>> & {
  id: string;
  createdAt: Date;
  isPaid: boolean;
  paidAt: Date | null;
  isDelivered: boolean;
  deliveredAt: Date | null;
  orderItems: OrderItem[];
  user: { name: string; email: string };
};
