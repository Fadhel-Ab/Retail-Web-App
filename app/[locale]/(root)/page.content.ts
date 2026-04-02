import { t, type Dictionary } from "intlayer";

const pageContent = {
  key: "page",
  content: {
    header: {
      title: t({
        en: "Store",
        ar: "المتجر",
      }),
      signIn: t({
        en: "Sign In",
        ar: "تسجيل الدخول",
      }),
      cart: t({
        en: "Cart",
        ar: "العربة",
      }),
      menu: t({
        en: "Menu",
        ar: "القائمة",
      }),
    },
    getStarted: {
      main: t({
        en: "Get started by editing",
        ar: "تجرية",
      }),
      pageLink: "src/app/page.tsx",
    },
    card:t({
        en: "Out Of Stock",
        ar: "غير متوفر حالياً",
      }),
      pageLink: "src/app/page.tsx",

  },
} satisfies Dictionary;

export default pageContent;
