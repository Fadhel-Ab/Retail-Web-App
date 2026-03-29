

import { getPageContent } from "@/lib/custom-hooks/intlayer-hook";

const  Homepage = async ({params
}: {params: Promise<{locale:string}> 
}) => {
  const {locale} = await params;
  const {getStarted} = await getPageContent("page",locale);
  console.log(` language: ${locale}`);
  return ( <>{getStarted.main}</> );
}
 
export default Homepage;