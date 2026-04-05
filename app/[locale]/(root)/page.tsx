import { getPageContent } from "@/lib/custom-hooks/intlayer-hook";

import ProductList from "@/components/shared/products/product-list";
import { getLatestProducts } from "@/lib/actions/products.actions";

const Homepage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  //const { header } = await getPageContent("page", locale); if needed 

  console.log(` language: ${locale}`);
  console.log(await getLatestProducts());
    const data = await getLatestProducts();

  return (
    <>
    
      <ProductList data={data} title="Featured Products" limit={4} locale={locale}/>
      
    </>
  );
};

export default Homepage;
