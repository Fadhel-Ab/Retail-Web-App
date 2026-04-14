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
    },
    card: t({
      en: "Out Of Stock",
      ar: "غير متوفر حالياً",
    }),

    productPage: {
      price: t({
        en: "Price",
        ar: "السعر",
      }),
      status: t({
        en: "Status",
        ar: "الحالة",
      }),
      addToCart: t({
        en: "Add to Cart",
        ar: "إضافة إلى العربة",
      }),
      inStock: t({
        en: "In Stock",
        ar: "متوفر",
      }),
      outOfStock: t({
        en: "Out Of Stock",
        ar: "غير متوفر حالياً",
      }),
    },
    metadata: {
      title: t({
        en: "Home | Fadhel Store",
        ar: "الرئيسية | متجر فاضل",
      }),
      description: t({ en: "Explore our app", ar: "استكشف تطبيقنا" }),
    },
  },
} satisfies Dictionary;

export default pageContent;
