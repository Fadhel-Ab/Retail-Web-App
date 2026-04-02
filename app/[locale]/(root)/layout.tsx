import Footer from "@/components/footer";
import Header from "@/components/shared/header";
import { IntlayerClientProvider } from "next-intlayer";
import { IntlayerServerProvider } from "next-intlayer/server";
import { ReactNode } from "react";

interface RootLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;
  console.log(`Root layout language: ${locale}`);
  return (
    <IntlayerServerProvider locale={locale}>
      <IntlayerClientProvider locale={locale}>
        <div className="flex h-screen flex-col">
          <Header locale={locale} />
          <main className="flex-1 wrapper">{children}</main>
          <Footer locale={locale} />
        </div>
      </IntlayerClientProvider>
    </IntlayerServerProvider>
  );
}
