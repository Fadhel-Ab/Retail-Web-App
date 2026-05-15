import NotFoundButton from "@/components/not-found-button";
import { APP_NAME } from "@/lib/constants";
import { getLocale } from "next-intlayer/server";
import Image from "next/image";

const NotFoundPage = async () => {
  const locale = await getLocale();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Image
        src="/images/logo.svg"
        width={48}
        height={48}
        priority={true}
        alt={`${APP_NAME} logo`}
      />
      <div className="p-6 w-1/3 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold mb-4">
          {locale === "en" ? "Not Found" : "الصفحة غير موجودة"}
        </h1>
        <p className="text-destructive">
          {locale === "en"
            ? "Could not find requested page"
            : "لم يتم العثور على الصفحة المطلوبة"}
        </p>
        <NotFoundButton locale={locale} />
      </div>
    </div>
  );
};

export default NotFoundPage;
