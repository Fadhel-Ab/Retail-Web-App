import { getPageContent } from "@/lib/custom-hooks/intlayer-hook";
import sampleData from "@/db/sample-data";
import ProductList from "@/components/shared/products/product-list";
import ProductCard from "@/components/shared/products/product-card";
const Homepage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  //const { header } = await getPageContent("page", locale);
 // console.log(header.menu);
  console.log(` language: ${locale}`);
  console.log(sampleData.products_ar);
  const data =
    locale === "en" ? sampleData.products_en : sampleData.products_ar;
  console.log(data);

  return (
    <>
    
      <ProductList data={data} title="Featured Products" limit={4} locale={locale}/>
      
    </>
  );
};

export default Homepage;
