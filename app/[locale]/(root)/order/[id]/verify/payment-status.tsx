"use client";

import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { use } from "react";
export default function PaymentPage({
  orderId,
  tapId,
  locale,
}: {
  orderId: string;
  tapId: string;
  locale: string;
}) {
  const [status, setStatus] = useState("pending...");

  useEffect(() => {
    let timer = 0;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/paymentResponse?orderId=${orderId}`);
        const data = await res.json();
        timer++;

        if (
          data.status === "CAPTURED" ||
          data.status === "DECLINED" ||
          data.status === "NOT CAPTURED"
        ) {
          setStatus(data.status);
          clearInterval(interval);
          console.log(data.status);
        } else if (timer >= 9) {
          console.log(data.status);
          setStatus("Timed Out");
          clearInterval(interval);
        } else {
          console.log(data.status);
          setStatus("Pending...");
        }
      } catch (err) {
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval); // Clean up on unmount
  }, [orderId]); // Restart if orderId changes

  if (status === "Pending..." || "")
    return (
      <p>
        <Loader className="animate-spin"></Loader>
        {locale === "en" ? "Confirming your payment..." : "تأكيد الدفع..."}
      </p>
    );
  if (status === "CAPTURED")
    return (
      <h1>
        {locale === "en" ? "Payment Successful! 🎉" : "تم الدفع بنجاح! 🎉"}
      </h1>
    );
  if (status === "DECLINED")
    return <h1>{locale === "en" ? "Payment was Declined" : "تم رفض الدفع"}</h1>;
  if (status === "NOT CAPTURED")
    return (
      <h1>
        {locale === "en"
          ? "Payment was Not Successful!"
          : "لم تتم عملية الدفع بنجاح!"}
      </h1>
    );
  if (status === "Timed Out")
    return (
      <h1>
        {locale === "en"
          ? "Payment was Not Successful!"
          : "لم تتم عملية الدفع بنجاح!"}
      </h1>
    );
}
