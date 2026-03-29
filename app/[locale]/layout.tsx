import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../assets/styles/globals.css";
import { APP_DESCRIPTION, APP_NAME, SERVER_URL } from "@/lib/constants";
import { IntlayerServerProvider } from "next-intlayer/server";
import { getHTMLTextDir } from "intlayer";
import { IntlayerClientProvider, type NextLayoutIntlayer } from "next-intlayer";
import { ThemeProvider } from "next-themes";

const InterSans = Inter({
  subsets: ["latin"],
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
      <body className={InterSans.className}>
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

/*
 <ThemeProvider
        attribute='class'
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
        >

        </ThemeProvider>

*/
