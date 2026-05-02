import { auth } from "@/auth";
import { getMyCart } from "@/lib/actions/cart.actions";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShippingAddress } from "@/types";
import { getUserById } from "@/lib/actions/users.actions";
import ShippingAddressForm from "./shipping-address-form";
import { toast } from "sonner";
import CheckOutSteps from "@/components/shared/checkout-steps";
type Props = {
  params: Promise<{ locale: string }>;
};
// can be done with getLocale in the layout and passing it down as a prop to avoid multiple calls, but this is just for demonstration also this is better
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  // Fetch localized content for the sign-in page
  return {
    title: locale === "en" ? "Shipping Address" : "عنوان الشحن", // This will be plugged into your layout's %s template
  };
}

const ShippingAddressPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;

  const cart = await getMyCart();
  if (!cart || cart.items.length == 0) redirect(`/${locale}/cart`);

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("No user ID");

  const user = await getUserById(userId);

  return (
    <>
    <CheckOutSteps current={1}></CheckOutSteps>
      <ShippingAddressForm
        address={user.address as ShippingAddress}
        locale={locale}
      ></ShippingAddressForm>
    </>
  );
};

export default ShippingAddressPage;
