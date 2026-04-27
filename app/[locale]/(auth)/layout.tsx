import { getLocale } from "next-intlayer/server";

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
  //testing
  // console.log(`Root layout language: ${locale}`);
  return <div className="flex-center min-h-screen w-full">{children}</div>;
}
