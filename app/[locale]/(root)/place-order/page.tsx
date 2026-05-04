import { auth } from "@/auth";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/users.actions";
import { ShippingAddress } from "@/types";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import CheckOutSteps from "@/components/shared/checkout-steps";

type Props = {
  params: Promise<{ locale: string }>;
};
// can be done with getLocale in the layout and passing it down as a prop to avoid multiple calls, but this is just for demonstration also this is better
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  // Fetch localized content for the sign-in page
  return {
    title: locale === "en" ? "Place Order" : "تأكيد الطلب", // This will be plugged into your layout's %s template
  };
}

const PlaceOrderPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  const cart = await getMyCart();
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("User not found");

  const user = await getUserById(userId);

  if (!cart || cart.items.length === 0) redirect(`/${locale}/cart`);
  if (!user.address) redirect(`/${locale}/shipping-address`);
  if (!user.paymentMethod) redirect(`/${locale}/payment-method`);

  const userAddress = user.address as ShippingAddress;

  return (
    <>
      <CheckOutSteps current={3} />
    </>
  );
};

export default PlaceOrderPage;
