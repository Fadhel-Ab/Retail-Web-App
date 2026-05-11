
"use client";
import { useTransition } from "react";
import { createPaymentCharge } from "@/lib/actions/payment.action";
import { Button } from "@/components/ui/button";
import { getOrderById } from "@/lib/actions/order.actions";

export default function BenefitPayButton({ orderId }: { orderId: string }) {
  const [isPending, startTransition] = useTransition();

 
  const handlePayment = () => {
    startTransition(async () => {
      const res = await createPaymentCharge(orderId);
      if (res.success) {
        window.location.href = res.paymentUrl; // Redirect to Tap Sandbox
      }
    });
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={isPending}
      className="bg-[#e90030] hover:bg-[#c70029] text-white w-full"
    >
      {isPending ? "Connecting..." : "Pay with BenefitPay"}
    </Button>
  );
}
