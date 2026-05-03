import { Metadata } from "next";
import { auth } from "@/auth";
import { getUserById } from "@/lib/actions/users.actions";
import CheckOutSteps from "@/components/shared/checkout-steps";
import PaymentMethodForm from "./payment-method-form";
import { promises } from "dns";
import { locale } from "react-intlayer/server";
type Props = {
  params: Promise<{ locale: string }>;
};
// can be done with getLocale in the layout and passing it down as a prop to avoid multiple calls, but this is just for demonstration also this is better
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  // Fetch localized content for the sign-in page
  return {
    title: locale === "en" ? "Payment Method" : "طريقة الدفع", // This will be plugged into your layout's %s template
  };
}
const PaymentMethodPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("User not found");

  const user = await getUserById(userId);
  return (
    <>
      <CheckOutSteps current={2} />
      <PaymentMethodForm
        preferredPaymentMethod={user.paymentMethod}
        locale={locale}
      />
    </>
  );
};

export default PaymentMethodPage;
