"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { defaultSignInValues } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signInWithCredentials } from "@/lib/actions/users.actions";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";

const CredentialSignInForm = ({ locale }: { locale: string }) => {
  const [state, formAction] = useActionState(signInWithCredentials, undefined);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const SignInButton = () => {
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
            ? "Signing In..."
            : "جارٍ تسجيل الدخول"
          : locale === "en"
            ? "Sign In"
            : "تسجيل الدخول"}
      </Button>
    );
  };

  return (
    <form action={formAction}>
      <input type="hidden" name="callbackUrl" value={callbackUrl ?? `/`} />
      <input type="hidden" name="locale" value={locale} />
      <div className="space-y-6">
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
            defaultValue={defaultSignInValues.email}
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
            defaultValue={defaultSignInValues.password}
          ></Input>
        </div>

        <div>
          <SignInButton />
        </div>
        {state && !state.success && (
          <div className="text-center text-destructive">{state.message} </div>
        )}
        <div className="text-sm text-center text-muted-foreground">
          {locale === "en" ? " You don't have an account? " : "ليس لديك حساب؟ "}
          <Link href={`/${locale}/sign-up`} target="_self" className="Link">
            {locale === "en" ? " click here to register" : "اضغط هنا للتسجيل "}
          </Link>
        </div>
      </div>
    </form>
  );
};

export default CredentialSignInForm;
