"use client";

import { useEffect, useState } from "react";
import { use } from "react";
export default function PaymentPage({ orderId, tapId }: { orderId: string; tapId: string }) {
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/paymentResponse?orderId=${orderId}`);
      const data = await res.json();

      if (data.isPaid) {
        setStatus("paid");
        clearInterval(interval);
      }
    }, 2000); // check every 2 seconds

    return () => clearInterval(interval);
  }, []);

  if (status === "pending") return <p>Confirming your payment...</p>;
  if (status === "paid") return <h1>Payment Successful! 🎉</h1>;
}
