import ProductList from "@/components/shared/products/product-list";
import { getLatestProducts } from "@/lib/actions/products.actions";
import { Metadata } from "next";


type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  // Fetch localized content for the sign-in page
  return {
    title: locale === "en" ? "Home" : "الرئيسية", // This will be plugged into your layout's %s template
  };
}


const Homepage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  //const { header } = await getPageContent("page", locale); if needed
  /*console.log(` language: ${locale}`);
  console.log(await getLatestProducts());*/ //testing
  const data = await getLatestProducts();

  return (
    <>
      <ProductList
        data={data}
        title="Featured Products"
        limit={4}
        locale={locale}
      />
    </>
  );
};

export default Homepage;
