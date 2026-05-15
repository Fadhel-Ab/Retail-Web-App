"use client";
import { use } from "react";
import { Button } from "./ui/button";

import { useRouter } from "next/navigation";

const NotFoundButton = ({ locale }: { locale: string }) => {
  const router = useRouter();
  const handleGoHome = () => {
    router.push("/" + locale);
  };
  return (
    <Button variant={"outline"} className={"mt-4 ms-2"} onClick={handleGoHome}>
      {locale === "en" ? "Go Home" : "العودة إلى الصفحة الرئيسية"}
    </Button>
  );
};

export default NotFoundButton;
