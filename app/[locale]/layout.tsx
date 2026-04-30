import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "../../assets/styles/globals.css";
import { IntlayerServerProvider } from "next-intlayer/server";
export { generateStaticParams } from "next-intlayer";
import { getHTMLTextDir } from "intlayer";
import {
  IntlayerClientProvider,
  type NextLayoutIntlayer,
} from "next-intlayer";
import { ThemeProvider } from "@/components/shared/header/theme-provider";
import { getPageContent } from "@/lib/custom-hooks/intlayer-hook";
import { Toaster } from "@/components/ui/sonner";

const rubik = Rubik({
  subsets: ["arabic", "latin"], // Essential for bilingual support       // Choose the weights you need
  display: "swap",
});
/*
export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(SERVER_URL),
}; */

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  // Use getIntlayer to fetch your translated content declaration
  // Ensure you have a content declaration file for 'app-metadata'
  const { metadata } = getPageContent("page", locale);
  //testing
  // console.log(metadata);
  return {
    title: {
      default: metadata.title.value,
      template: `%s | ${metadata.title.value}`,
    },
    description: metadata.description.value,
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SERVER_URL ||
        "https://retail-web-app-swart.vercel.app/",
    ),
    // Best Practice: Hreflang tags for SEO
    alternates: {
      canonical: "/",
      languages: {
        en: "/en",
        ar: "/ar",
      },
    },
  };
}

const LocaleLayout: NextLayoutIntlayer = async ({ children, params }) => {
  const { locale } = await params;
  const dir = getHTMLTextDir(locale);
  // testing
  // console.log(dir);
  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className={rubik.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <IntlayerServerProvider locale={locale}>
            <IntlayerClientProvider locale={locale}>
              {children}
            </IntlayerClientProvider>
          </IntlayerServerProvider>
          <Toaster  position={locale === "en" ? "bottom-right" : "bottom-left"} richColors/>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default LocaleLayout;
