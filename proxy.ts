// proxy.ts or middleware.ts 
import { auth } from "@/auth"; //  Auth.js config
import { intlayerProxy } from "next-intlayer/proxy";
import { getLocale } from "next-intlayer/server";
import { NextResponse } from "next/server"; // no need, intlayer is already expecting the response
import { locale } from "react-intlayer/server";

export const proxy = auth((req) => {
  
  
  
  // Auth.js will pre-fill req.auth with the user session
  // Then we let Intlayer handle the routing/localization

  // Step 1: create response // let intlayer create the response
  const res = intlayerProxy(req);
  // Step 2: CART LOGIC
  let cartId = req.cookies.get("sessionCartId")?.value || null;

  if (!cartId) {
    cartId = crypto.randomUUID();

    res.cookies.set("sessionCartId", cartId);
  }

  return res;
});

export const config = {
  matcher:
    "/((?!api|static|assets|robots|sitemap|sw|service-worker|manifest|.*\\..*|_next).*)",
};
