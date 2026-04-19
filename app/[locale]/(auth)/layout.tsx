import Footer from "@/components/footer";
import Header from "@/components/shared/header";
import { IntlayerClientProvider } from "next-intlayer";
import { IntlayerServerProvider } from "next-intlayer/server";
import { ReactNode } from "react";

interface RootLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function AuthLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;
  console.log(`Root layout language: ${locale}`);
  return <div className="flex-center min-h-screen w-full">{children}</div>;
}
