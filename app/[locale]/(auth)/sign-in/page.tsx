import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getPageContent } from "@/lib/custom-hooks/intlayer-hook";
import type { Metadata } from "next";
import Link from "next/link";
import { locale } from "react-intlayer/server";
import Image from "next/image";
import { APP_NAME } from "@/lib/constants";
import CredentialSignInForm from "./credentials-signing-form";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  // Fetch localized content for the sign-in page
  return {
    title: locale === "en" ? "Sign In" : "تسجيل الدخول", // This will be plugged into your layout's %s template
  };
}

const SignInPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          <Link href={`/${locale}`} className="flex-center">
            <Image
              src={"/images/logo.svg"}
              width={100}
              height={100}
              alt={`${APP_NAME} logo`}
              priority={true}
            ></Image>
          </Link>
          <CardTitle className="text-center">
            {locale === "en" ? "Sign In" : "تسجيل الدخول"}
          </CardTitle>
          <CardDescription className="text-center">
            {locale === "en"
              ? "Sign in to your account"
              : "قم بتسجيل الدخول إلى حسابك"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <CredentialSignInForm locale={locale}></CredentialSignInForm>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInPage;
