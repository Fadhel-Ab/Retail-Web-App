/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { CartResponse } from "@/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTransition } from "react";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { ArrowRight, Divide, Loader, Minus, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const CartTable = ({
  cart,
  locale,
}: {
  cart?: CartResponse;
  locale: string;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <h1 className="py-4 h2-bold">
        {locale === "en" ? "Shopping Cart" : "عربة التسوق"}
      </h1>
      {!cart || cart.items.length === 0 ? (
        <div className="">
          {locale === "en" ? "Cart is empty" : "العربة فارغة"}{" "}
          <Link href={`/${locale}/`}>
            {locale === "en" ? "Go Shopping" : "ابدا التسوق"}
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5 ">
          <div className="overflow-x-auto md:col-span-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
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
                          height={50}
                          width={50}
                        ></Image>{" "}
                        <span className="px-2">
                          {locale === "en" ? item.name : item.nameAr}
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell className="flex-center gap-2">
                      {/* // eslint-disable-next-line react-hooks/rules-of-hooks */}
                      <Button
                        disabled={isPending}
                        variant={"outline"}
                        type="button"
                        onClick={() =>
                          startTransition(async () => {
                            const res = await removeItemFromCart(
                              item.productId,
                            );
                            if (!res.success) {
                              toast.error(res.message);
                              return;
                            }
                            toast.success(res.message);
                            return;
                          })
                        }
                      >
                        {isPending ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Minus className="h-4 w-5" />
                        )}
                      </Button>
                      <span className="text-lg">{item.qty}</span>
                      <Button
                        disabled={isPending}
                        variant={"outline"}
                        type="button"
                        onClick={() =>
                          startTransition(async () => {
                            const res = await addItemToCart(item);
                            //handle failure adding to cart
                            if (!res.success) {
                              toast.error(res.message);
                              return;
                            }

                            //handle success add to cart
                            toast.success(res.message, {
                              action: (
                                <Button
                                  className={
                                    "bg-primary text-primary-foreground hover:bg-muted-foreground cursor-pointer"
                                  }
                                  onClick={() => router.push(`/${locale}/cart`)}
                                >
                                  {locale === "en"
                                    ? "Go to Cart"
                                    : "الذهاب إلى السلة"}
                                </Button>
                              ),
                            });
                            return;
                          })
                        }
                      >
                        {isPending ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-5" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">${item.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <span> testing<br/> total with taxes:<br></br> {cart.totalPrice}</span>
        </div>
      )}
    </>
  );
};

export default CartTable;
