import { Button } from "@/components/ui/button";
import ModeToggle from "./toggle-mode";
import { EllipsisVertical, ShoppingCart, UserIcon } from "lucide-react";
import Link from "next/link";

import { getPageContent } from "@/lib/custom-hooks/intlayer-hook";
import { LocaleSwitcher } from "./language-select";
import { getHTMLTextDir, LocalesValues } from "intlayer";
import { useIntlayer } from "next-intlayer/server";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";



const Menu =  ({locale}:{locale:string}) => {
  const {header} = useIntlayer("page",locale);
  const dir =  getHTMLTextDir(locale);
  console.log(`dir: ${dir}`);
  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full max-w-xs gap-1">
        <LocaleSwitcher />
        <ModeToggle />
        <Button
          nativeButton={false}
          render={<Link href="/cart" />}
          variant="ghost"
        >
          <ShoppingCart /> {header.cart}
        </Button>
        <Button nativeButton={false} render={<Link href="/sign-in" />}>
          <UserIcon /> {header.signIn}
        </Button>
      </nav>
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle">
            <EllipsisVertical />
          </SheetTrigger>
          <SheetContent side={dir === "rtl" ? "left" : "right"} >
            <SheetHeader>
              <SheetTitle>{header.menu}</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 items-start ms-4">
              <ModeToggle />
              <LocaleSwitcher />
              <Button
                nativeButton={false}
                render={<Link href={"/cart"} />}
                variant="ghost"
              >
                <ShoppingCart /> {header.cart}
              </Button>
              <Button nativeButton={false} render={<Link href="/sign-in" />}>
                <UserIcon /> {header.signIn}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
