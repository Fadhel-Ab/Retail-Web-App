"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { defaultSignUpValues } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignUpUser } from "@/lib/actions/users.actions";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";

const SignUpForm = ({ locale }: { locale: string }) => {
  const [state, formAction] = useActionState(SignUpUser, {
    success: false,
    message: "",
  });
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const SignUpButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button
        type="submit"
        disabled={pending}
        className={"w-full cursor-pointer"}
        variant={"default"}
      >
        {pending
          ? locale === "en"
            ? "Submitting..."
            : "جارٍ التسجيل "
          : locale === "en"
            ? "Sign Up"
            : "تسجيل "}
      </Button>
    );
  };

  return (
    <form action={formAction}>
      <input type="hidden" name="callbackUrl" value={callbackUrl ?? `/`} />
      <input type="hidden" name="locale" value={locale} />
      <div className="space-y-6">
        <div>
          <Label htmlFor="name" className="mb-1">
            {locale === "en" ? "name" : "الأسم"}
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            defaultValue={defaultSignUpValues.name}
          ></Input>
        </div>
        <div>
          <Label htmlFor="email" className="mb-1">
            {locale === "en" ? "Email" : "البريد الإلكتروني"}
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={defaultSignUpValues.email}
          ></Input>
        </div>
        <div>
          <Label htmlFor="password" className="mb-1">
            {locale === "en" ? "Password" : "كلمة المرور"}
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="password"
            defaultValue={defaultSignUpValues.password}
          ></Input>
        </div>
        <div>
          <Label htmlFor="confirmPassword" className="mb-1">
            {locale === "en" ? "confirm Password" : "تأكيد كلمة المرور"}
          </Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="Password"
            required
            autoComplete="confirmPassword"
            defaultValue={defaultSignUpValues.confirmPassword}
          ></Input>
        </div>
        <div>
          <SignUpButton />
        </div>
        {state && !state.success && (
          <div className="text-center text-destructive">{state.message} </div>
        )}
        <div className="text-sm text-center text-muted-foreground">
          {locale === "en" ? " Already have an account? " : "هل لديك حساب؟ "}
          <Link href={`/${locale}/sign-in`} target="_self" className="Link">
            {locale === "en"
              ? " click here to Sign In"
              : "اضغط هنا لتسجيل الدخول"}
          </Link>
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;
