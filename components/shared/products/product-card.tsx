import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import ProductPrice from "./product-price";
import { getPageContent } from "@/lib/custom-hooks/intlayer-hook";
import { Product } from "@/types";

const ProductCard = async ({
  product,
  locale,
}: {
  product: Product;
  locale: string;
}) => {
  const available = await getPageContent("page", locale);
  const translatedName = locale === "en" ? product.name : product.nameAr;
  const translatedBrand = locale === "en" ? product.brand : product.brandAr;
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="w-75 h-75 ">
        <Link href={`${locale}/product/${product.slug}`}>
          <Image
          className="object-cover"
            src={product.images[0]}
            alt={translatedName}
            height={300}
            width={300}
            priority={true}
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 grid gap-4">
        <div className="text-xs">{translatedBrand}</div>
        <Link href={`/product/${product.slug}`}>
          <h2 className="text-sm font-medium">{translatedName}</h2>
        </Link>
        <div className="flex-between gap-4">
          <p>{product.rating} stars</p>
          {product.stock > 0 ? (
            <ProductPrice value={Number(product.price)} />
          ) : (
            <div className="p text-destructive">{available.card}</div>
          )}
        </div>
        <Button
              className={"w-full cursor-pointer"}
              type="button"
              onClick={handleAddToCart}
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <PlusIcon className="h-4 w-5" />
              )}
              {locale === "en" ? "Add to Cart" : "أضف إلى السلة"}
            </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
