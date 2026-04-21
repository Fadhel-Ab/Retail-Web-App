'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Children } from "react";

const SignInButton = ({ children, locale }: { children: React.ReactNode; locale: string }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const pathname = usePathname();
    return (<Button
                nativeButton={false}
                render={
                  <Link
                    href={`/${locale}/sign-in?callbackUrl=${encodeURIComponent(pathname)}`}
                    className="btn-signin"
                  />
                }
              >{children}</Button> );
}
 
export default SignInButton;