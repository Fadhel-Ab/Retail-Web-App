import type { Metadata } from "next";
import { Rubik } from 'next/font/google';
import "../../assets/styles/globals.css";
import { APP_DESCRIPTION, APP_NAME, SERVER_URL } from "@/lib/constants";
import { IntlayerServerProvider } from "next-intlayer/server";
import { getHTMLTextDir } from "intlayer";
import { IntlayerClientProvider, type NextLayoutIntlayer } from "next-intlayer";
import { ThemeProvider } from "@/components/shared/header/theme-provider";

const rubik = Rubik({
  subsets: ['arabic', 'latin'], // Essential for bilingual support       // Choose the weights you need
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(SERVER_URL),
};

const LocaleLayout: NextLayoutIntlayer = async ({ children, params }) => {
  const { locale } = await params;
  const dir = getHTMLTextDir(locale);
  console.log(dir);
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
        </ThemeProvider>
      </body>
    </html>
  );
};

export default LocaleLayout;

