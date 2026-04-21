'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Children } from "react";

const SignInButton = ({ children }: { children: React.ReactNode }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const pathname = usePathname();
    return (<Button
                nativeButton={false}
                render={
                  <Link
                    href={`/sign-in?callbackUrl=${encodeURIComponent(pathname)}`}
                    className="btn-signin"
                  />
                }
              >{children}</Button> );
}
 
export default SignInButton;