// proxy.ts or middleware.ts
import { auth } from "@/auth"; // Your Auth.js config
import { intlayerProxy } from "next-intlayer/proxy";

export const proxy = auth((req) => {
  // Auth.js will pre-fill req.auth with the user session
  // Then we let Intlayer handle the routing/localization
  return intlayerProxy(req);
});

export const config = {
  // Your existing matcher is fine as it already excludes /api routes
  matcher: "/((?!api|static|assets|robots|sitemap|sw|service-worker|manifest|.*\\..*|_next).*)",
};
