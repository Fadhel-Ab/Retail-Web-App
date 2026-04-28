"use server";
import { CartItem, CartResponse } from "@/types";
import { formatError } from "@/lib/server-side-utils";
import { getLocale } from "next-intlayer/server";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { CartResponseSchema, ProductResponseSchema, cartItemSchema } from "../validators";

export async function addItemToCart(data: CartItem) {
  const locale = await getLocale();
  const translatedSuccessMessage =
    locale === "en" ? " has been added to your cart" : " تم إضافته إلى سلتك";
  const translatedErrorMessage =
    locale === "en"
      ? "Failed to add item to cart"
      : "فشل في إضافة المنتج إلى السلة";
  try {
    const cookieStore = await cookies();
    const cartId = cookieStore.get("sessionCartId")?.value || null;

    if (!cartId)
      throw new Error(
        locale === "en" ? "No cartId found" : "لم يتم العثور على معرف السلة",
      );

    const session = await auth();
    const userId = session?.user?.id || null;

    //Get cart
    const cart = await getMyCart();

    //validate item before adding it to cart
    const item = cartItemSchema.parse(data);

    //now find the product in db before adding it to cart to make sure it exists and to get the latest price and stock
    const rawProduct = await prisma.product.findUnique({
      where: { id: item.productId },
    });
  //parse product_validate
    const product = ProductResponseSchema.parse(rawProduct);
    
    //testing
    console.log({ sessionCartId: cartId, userId: userId, Item: item, Product: product });

    return {
      success: true,
      message: translatedSuccessMessage,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error) || translatedErrorMessage,
    };
  }
}

export async function getMyCart() {
  const locale = await getLocale();

  const cookieStore = await cookies();
  const cartId = cookieStore.get("sessionCartId")?.value || null;

  if (!cartId)
    throw new Error(
      locale === "en" ? "No cartId found" : "لم يتم العثور على معرف السلة",
    );

  const session = await auth();
  const userId = session?.user?.id || null;

  // get user cart frm database
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: cartId },
  });

  if (!cart) return undefined;

  const formattedData = CartResponseSchema.parse(cart);
  return formattedData;
}
