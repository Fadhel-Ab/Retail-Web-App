/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
/*
export default function BenefitPayButton() {
  async function handlePayment() {
    try {
      // Call backend route
      const response = await fetch("/api/tap/hash", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: "1.000",
        }),
      });

      const data = await response.json();

      console.log("Tap Data:", data);

      alert("Hash generated successfully!");
    } catch (error) {
      console.error(error);

      alert("Something went wrong");
    }
  }

  return (
    <button
      onClick={handlePayment}
      className="bg-red-500 text-white px-4 py-2 rounded-md"
    >
      Pay with BenefitPay
    </button>
  );
}*/


"use client";
import { useTransition } from "react";
import { createPaymentCharge } from "@/lib/actions/payment.action";
import { Button } from "@/components/ui/button";

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
