import { auth } from "@/auth";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/users.actions";
import { ShippingAddress } from "@/types";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import CheckOutSteps from "@/components/shared/checkout-steps";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";

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
      <h1 className="pb-3 text-2xl">Place Order</h1>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="md:col-span-2  space-y-4">
          <Card>
            <CardContent className="px-4 gap-4">
              <h2 className="text-xl pb-4">
                {locale === "en" ? "Shipping Address" : "عنوان الشحن"}
              </h2>
              <div className="overflow-x-auto whitespace-nowrap">
                <p className="font-medium">{userAddress.fullName}</p>
                <p className="text-muted-foreground">
                  {userAddress.streetAddress}, {userAddress.city}{" "}
                  {userAddress.postalCode}, {userAddress.country}
                </p>
              </div>
              <div className="mt-3">
                <Link href={`/${locale}/shipping-address`}>
                  <Button variant={"outline"}>
                    {locale === "en" ? "Edit" : "تعديل"}
                  </Button>{" "}
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="px-4 gap-4">
              <h2 className="text-xl pb-4">
                {locale === "en" ? "Payment Method" : "طريقة الدفع"}
              </h2>
              <div className="overflow-x-auto whitespace-nowrap">
                <p className="">{user.paymentMethod}</p>
              </div>
              <div className="mt-3">
                <Link href={`/${locale}/payment-method`}>
                  <Button variant={"outline"}>
                    {locale === "en" ? "Edit" : "تعديل"}
                  </Button>{" "}
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="px-4 gap-4">
              <h2 className="text-xl pb-4">
                {locale === "en" ? "Order Items" : "عناصر الطلب"}
              </h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-start">
                      {locale === "en" ? "Item" : "العنصر"}
                    </TableHead>
                    <TableHead className="text-center">
                      {locale === "en" ? "Quantity" : "الكمية"}
                    </TableHead>
                    <TableHead className="text-end">
                      {locale === "en" ? "Price" : "السعر"}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.items.map((item) => (
                    <TableRow key={item.slug}>
                      <TableCell>
                        <Link
                          href={`/${locale}/product/${item.slug}`}
                          className="flex items-center"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          ></Image>
                          <span>
                            {locale === "en" ? item.name : item.nameAr}
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell className="text-center">{item.qty}</TableCell>
                      <TableCell className="text-end">{formatCurrency(item.price)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PlaceOrderPage;
