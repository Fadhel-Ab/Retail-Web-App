"use client";
import { useRouter } from "next/navigation";
import { Check, Loader } from "lucide-react";
import { createOrder } from "@/lib/actions/order.actions";

import { Button } from "@/components/ui/button";
import { useTransition } from "react";

const PlaceOrderForm = ({ locale }: { locale: string }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleAction = () => {
    startTransition(async () => {
      const res = await createOrder();

      if (res.success && res.redirectTo) {
        router.push(`/${locale}${res.redirectTo}`);
      } else {
        console.error(res.message);
      }
    });
  };

  return (
    <Button disabled={isPending} onClick={handleAction} className="w-full">
      {isPending ? (
        <Loader className="w-4 h-4 animate-spin mr-2" />
      ) : (
        <Check className="w-4 h-4 mr-2" />
      )}
      {locale === "en" ? "Place Order" : "إتمام الطلب"}
    </Button>
  );
};

export default PlaceOrderForm;
