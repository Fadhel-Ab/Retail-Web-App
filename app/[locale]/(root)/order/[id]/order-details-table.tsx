import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { OrderResponse } from "@/types";
import Link from "next/link";
import Image from "next/image";
import PlaceOrderForm from "../../place-order/place-order-form";
import BenefitPayButton from "./payment-benfit";




export default function OrderDetailsTable({
  order,
  locale,
}: {
  order: OrderResponse;
  locale: string;
}) {
  const {
    id,
    shippingAddress,
    orderItems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentMethod,
    isDelivered,
    isPaid,
    paidAt,
    deliveredAt,
  } = order;

  return (
    <>
      <h1 className="py-4 text-2xl ">
        {locale === "en" ? "Order" : "الطلب"} {formatId(id)}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-5">
        <div className="col-span-2 space-4-y overflow-x auto">
          <Card>
            <CardContent className="py-2 px-5 gap-2">
              <h2 className="text-xl pb-4">Payment Method</h2>
              <p className="mb-2">{paymentMethod}</p>
              {isPaid ? (
                <Badge variant={"secondary"}>
                  Paid at {formatDateTime(new Date(paidAt!)).dateTime}
                </Badge>
              ) : (
                <Badge variant={"destructive"}>Not paid</Badge>
              )}
            </CardContent>
          </Card>
          <Card className="my-3">
            <CardContent className="py-2 px-5 gap-2">
              <h2 className="text-xl pb-4">Shipping Address</h2>
              <p>{shippingAddress.fullName}</p>
              <p className="mb-2">
                {shippingAddress.streetAddress}, {shippingAddress.city}
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>

              {isDelivered ? (
                <Badge variant={"secondary"}>
                  Delivered at {formatDateTime(new Date(deliveredAt!)).dateTime}
                </Badge>
              ) : (
                <Badge variant={"destructive"}>Not Delivered</Badge>
              )}
            </CardContent>
          </Card>
          <Card className="my-3 px-5">
            <h2 className="text xl pb-4">Order Items</h2>
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
                {orderItems.map((item) => (
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
                        <span>{locale === "en" ? item.name : item.nameAr}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="text-center">{item.qty}</TableCell>
                    <TableCell className="text-end">${item.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className="px-4 gap-4 space-y-4 text-lg mt-5">
              <div className="flex justify-between ">
                <div>{locale === "en" ? "Items" : "العنصر"}</div>
                <div>{formatCurrency(itemsPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>{locale === "en" ? "Tax" : "الضريبة"}</div>
                <div>{formatCurrency(taxPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>{locale === "en" ? "Shipping" : "الشحن"}</div>
                <div>{formatCurrency(shippingPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>{locale === "en" ? "Total Price" : "المبلغ الإجمالي"}</div>
                <div>{formatCurrency(totalPrice)}</div>
              </div>
              <BenefitPayButton orderId={id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
