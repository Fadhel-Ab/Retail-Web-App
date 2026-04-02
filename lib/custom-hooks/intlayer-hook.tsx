// lib/usePageContent.ts
import { useIntlayer } from "next-intlayer/server";


export  function getPageContent(key: string, locale?: string)  {

  
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useIntlayer(key, locale);
}