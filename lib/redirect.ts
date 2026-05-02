import { redirect } from "next/navigation";

/**
 * A safe, locale-aware redirect for Server Actions and Components
 */
export function localizedRedirect(path: string, locale: string) {
  // 1. Security: Default to home if path is invalid or empty
  let destination = path.startsWith("/") ? path : "/";

  // checkIsLocalized: Checks if path starts with '/en/', '/ar/', etc.
  const isAlreadyLocalized =
    destination.startsWith(`/${locale}/`) || destination === `/${locale}`;

  if (!isAlreadyLocalized) {
    destination = `/${locale}${destination === "/" ? "" : destination}`;
  }
  return redirect(destination);
}
