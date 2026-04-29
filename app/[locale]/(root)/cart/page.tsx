import type { Metadata } from "next";
import CartTable from "./cart-table";
import { getMyCart } from "@/lib/actions/cart.actions";

type Props = {
  params: Promise<{ locale: string }>;
};
// can be done with getLocale in the layout and passing it down as a prop to avoid multiple calls, but this is just for demonstration also this is better
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  // Fetch localized content for the sign-in page
  return {
    title: locale === "en" ? "Cart" : "العربة", // This will be plugged into your layout's %s template
  };
}




const CartPage = async({params}:{params:Promise<{locale:string}>}) => {
    const cart= await getMyCart();
    const {locale}=await params;
  return <><CartTable cart={cart} locale={locale}></CartTable></>;
};

export default CartPage;
