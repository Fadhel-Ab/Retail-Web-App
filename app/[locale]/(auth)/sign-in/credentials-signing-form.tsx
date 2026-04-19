"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { defaultSignInValues } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const CredentialSignInForm = ({ locale }: { locale: string }) => {
  return (
    <form>
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
          <Button className={"w-full cursor-pointer h-9"} variant={"default"}>
            {" "}
            {locale === "en" ? "Sign In" : "تسجيل الدخول"}
          </Button>
        </div>
        <div className="text-sm text-center text-muted-foreground">
          {locale === "en" ? " You don't have an account? " : "ليس لديك حساب؟ "}
          <Link href={`${locale}/sign-up`} target="_self" className="Link">
            {locale === "en" ? " click here to register" : "اضغط هنا للتسجيل "}
          </Link>
        </div>
      </div>
    </form>
  );
};

export default CredentialSignInForm;
