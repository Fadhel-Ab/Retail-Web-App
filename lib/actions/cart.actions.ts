"use server";
import { CartItem } from "@/types";
import { formatError } from "@/lib/server-side-utils";
import { getLocale } from "next-intlayer/server";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import prisma from '@/lib/prisma'

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
    //testing
    console.log({ sessionCartId: cartId, userId: userId });

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

export async function name() {
   const locale = await getLocale();

   const cookieStore = await cookies();
   const cartId = cookieStore.get("sessionCartId")?.value || null;

   if (!cartId)
     throw new Error(
       locale === "en" ? "No cartId found" : "لم يتم العثور على معرف السلة",
     );

   const session = await auth();
   const userId = session?.user?.id || null;

     const cart= await prisma.cart.findFirst({
      where: userId ? {userId:userId} : {sessionCartId: cartId}
     });
     
}
