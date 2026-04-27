"use client";

import { CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { PlusIcon } from "lucide-react";
import { toast, useSonner } from "sonner";
import { addItemToCart } from "@/lib/actions/cart.actions";

const AddToCart = ({ item, locale }: { item: CartItem; locale: string }) => {
  const router = useRouter();

  const handleAddToCart = async () => {
    const res = await addItemToCart(item);
    //handle failure adding to cart
    if (!res.success) {
      toast.error(res.message);
      return;
    }
    const translatedName = locale === "en" ? item.name : item.nameAr;
    //handle success add to cart
    toast.success(translatedName + res.message, {
      action: (
        <Button
          className={
            "bg-primary text-primary-foreground hover:bg-muted-foreground cursor-pointer"
          }
          onClick={() => router.push(`/${locale}/cart`)}
        >
          {locale === "en" ? "Go to Cart" : "الذهاب إلى السلة"}
        </Button>
      ),
    });
  };

  return (
    <Button
      className={"w-full cursor-pointer"}
      type="button"
      onClick={handleAddToCart}
    >
      <PlusIcon />
      {locale === "en" ? "Add to Cart" : "أضف إلى السلة"}
    </Button>
  );
};

export default AddToCart;
