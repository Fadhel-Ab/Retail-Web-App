"use server";
import { CartItem } from "@/types";
import { formatError } from "@/lib/server-side-utils";
import { getLocale } from "next-intlayer/server";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  CartResponseSchema,
  ProductResponseSchema,
  cartItemSchema,
  insertCartSchema,
} from "../validators";
import { round2 } from "../utils";
import { Prisma } from "@prisma/client";
import { success } from "zod";

// calculate cart prices
const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
      items.reduce((sum, item) => sum + Number(item.price) * item.qty, 0),
    ),
    shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
    taxPrice = round2(0.15 * itemsPrice),
    totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export async function addItemToCart(data: CartItem) {
  const locale = await getLocale();
  const translatedName = locale === "en" ? data.name : data.nameAr;
  const translatedSuccessMessage =
    locale === "en"
      ? `${translatedName} has been added to your cart`
      : ` تم إضافته إلى سلتك ${translatedName}`;
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

    console.log("the cart" + cart);

    //validate item before adding it to cart
    const item = cartItemSchema.parse(data);

    //now find the product in db before adding it to cart to make sure it exists and to get the latest price and stock
    const rawProduct = await prisma.product.findUnique({
      where: { id: item.productId },
    });

    if (!rawProduct)
      throw new Error(
        locale === "en" ? "Product not found" : "المنتج غير موجود",
      );
    //parse product_validate
    const product = ProductResponseSchema.parse(rawProduct);

    if (!cart) {
      // create new cart object

      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: cartId,
        ...calcPrice([item]),
      });
      //add to db
      await prisma.cart.create({
        data: newCart,
      });

      //revalidate or refresh page data the
      revalidatePath(`/${locale}/product/${product.slug}`);
      return {
        success: true,
        message: translatedSuccessMessage,
      };
    } else {
      // check if item already in cart
      const existItem = (cart.items as CartItem[]).find(
        (i) => i.productId === item.productId,
      );

      if (existItem) {
        //check stock
        if (product.stock < existItem.qty + 1) {
          throw new Error("Not enough stock");
        }

        //increase quantity
        existItem.qty += 1;
      } else {
        // if item does not exist in the found cart (already existing cart)
        //check stock as well
        if (product.stock < 1) throw new Error("Not enough stock");
        //add item to cart.items

        cart.items.push(item);
      }

      //save to db
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.InputJsonValue[],
          ...calcPrice(cart.items as CartItem[]),
        },
      });

      revalidatePath(`/${locale}/product/${product.slug}`);
      return {
        success: true,
        message: existItem
          ? locale === "en"
            ? "Cart updated successfully"
            : "تم تحديث السلة بنجاح"
          : translatedSuccessMessage,
      };
    }
    //testing
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

  return CartResponseSchema.parse(cart);
}

export async function removeItemFromCart(productId: string) {
  const locale = await getLocale();

  try {
    const cookieStore = await cookies();
    const cartId = cookieStore.get("sessionCartId")?.value || null;

    if (!cartId)
      throw new Error(
        locale === "en" ? "No cartId found" : "لم يتم العثور على معرف السلة",
      );

    //get Product from db
    const product = await prisma.product.findFirst({
      where: { id: productId },
    });
    if (!product) throw new Error("Product not found");

    //get the cart
    const cart = await getMyCart();
    if (!cart) throw new Error("Cart not found");

    // check if item exist in cart
    const exist = (cart.items as CartItem[]).find(
      (i) => i.productId === productId,
    );
    if (!exist) throw new Error("Item not found");

    //check item quantity
    if (exist.qty === 1) {
      // we remove it
      cart.items = (cart.items as CartItem[]).filter(
        (i) => i.productId !== exist.productId,
      );
    } else {
      // decrease quantity
      (cart.items as CartItem[]).find(
        (i) => i.productId === exist.productId,
      )!.qty = exist.qty - 1;
    }

    //update the cart in database
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items as Prisma.InputJsonValue[],
        ...calcPrice(cart.items as CartItem[]),
      },
    });
    revalidatePath(`/${locale}/product/${product.slug}`);

    return {
      success: true,
      message:
        locale == "en"
          ? `${product.name} was removed from cart`
          : `تمت إزالته من سلة التسوق ${product.nameAr}`,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
