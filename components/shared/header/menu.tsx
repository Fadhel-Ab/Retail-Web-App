import { Button } from "@/components/ui/button";
import ModeToggle from "./toggle-mode";
import { EllipsisVertical, ShoppingCart, UserIcon } from "lucide-react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Menu = () => {
  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full max-w-xs gap-1">
        <ModeToggle />
        <Button
          nativeButton={false}
          render={<Link href="/cart" />}
          variant="ghost"
        >
          <ShoppingCart /> Cart
        </Button>
        <Button nativeButton={false} render={<Link href="/sign-in" />}>
          <UserIcon /> Sign In
        </Button>
      </nav>
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle">
            <EllipsisVertical />
          </SheetTrigger>
          <SheetContent >
            <SheetHeader>
            <SheetTitle >Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 items-start ms-4">
            <ModeToggle/>
            <Button
              nativeButton={false}
              render={<Link href={"/cart"} />}
              variant="ghost"
            >
              <ShoppingCart /> Cart
            </Button>
            <Button nativeButton={false} render={<Link href="/sign-in" />}>
          <UserIcon /> Sign In
        </Button>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
