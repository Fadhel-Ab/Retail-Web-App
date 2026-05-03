"use server";

import {
  signInFormSchema,
  createSignUpSchema,
  createShippingAddressSchema,
  createPaymentMethodSchema,
} from "../validators";
import { auth, signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/lib/prisma";
import { formatError } from "@/lib/server-side-utils";
import { getLocale } from "next-intlayer/server";
import { ShippingAddress, paymentMethod } from "@/types";
import { success, z } from "zod";
import { AwardIcon } from "lucide-react";

//Sign in user with credentials
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData,
) {
  const locale = formData.get("locale") as string;
  const callbackUrl = (formData.get("callbackUrl") as string) || `/`;
  try {
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    await signIn("credentials", user, { redirectTo: callbackUrl });
    return {
      success: true,
      message:
        locale === "en" ? "Signed in successfully" : "تم تسجيل الدخول بنجاح",
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return {
      success: false,
      message:
        locale === "en"
          ? "Invalid email or password"
          : "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    };
  }
}
//sign out user
export async function signOutUser() {
  await signOut();
}
//sign up user
export async function SignUpUser(prevState: unknown, formData: FormData) {
  const locale = await getLocale();
  const signUpFormSchema = await createSignUpSchema(locale);
  try {
    const user = signUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });
    const plainPassword = user.password;
    user.password = hashSync(user.password, 10);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    await signIn("credentials", {
      email: user.email,
      password: plainPassword,
    });
    return { success: true, message: "User created successfully" };
  } catch (error) {
    // console.log(error.name);
    // console.log(error.code);
    // console.log(error.errors);
    // console.log(error.meta?.target);
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: formatError(error) };
  }
}

//get user by the ID
export async function getUserById(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });
  if (!user) throw new Error("User not found");
  return user;
}

//update the user address
export async function updateUserAddress(data: ShippingAddress) {
  const locale = await getLocale();
  try {
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });
    if (!currentUser) throw new Error("User not found");
    const ShippingAddressSchema = await createShippingAddressSchema(locale);
    const address = ShippingAddressSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { address },
    });
    return {
      success: true,
      message:
        locale === "en" ? "User update successfully" : "تم تحديث المستخد بنجاح",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

//update user payment method
export async function updateUserPaymentMethod(
  data: paymentMethod,
  locale: string,
) {
  try {
    const paymentMethodSchema = await createPaymentMethodSchema(locale);

    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });
    if (!currentUser) throw new Error("User not found");
    const paymentMethod = paymentMethodSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { paymentMethod: paymentMethod.type },
    });
    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
