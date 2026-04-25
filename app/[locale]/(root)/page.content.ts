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
        en: "Fadhel Store",
        ar: "متجر فاضل",
      }),
      description: t({ en: "Explore our app", ar: "استكشف تطبيقنا" }),
    },

    signUpValidation: {
      name: t({
        en: "Name must be at least 3 characters",
        ar: "الاسم يجب أن يكون على الأقل 3 أحرف",
      }),
      email: t({
        en: "Invalid email address",
        ar: "البريد الإلكتروني غير صالح",
      }),
      password: t({
        en: "Password must be at least 6 characters",
        ar: "كلمة المرور يجب أن تكون على الأقل 6 أحرف",
      }),
      confirmPassword: t({
        en: "Confirm Password must be at least 6 characters",
        ar: "تأكيد كلمة المرور يجب أن تكون على الأقل 6 أحرف",
      }),
      mismatch: t({
        en: "Passwords don't match",
        ar: "كلمات المرور غير متطابقة",
      }),
    },
  },
} satisfies Dictionary;

export default pageContent;
