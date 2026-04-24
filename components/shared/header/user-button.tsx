import { LogOut, UserIcon } from "lucide-react";
import SignInButton from "./sign-in-button";
import { signOutUser } from "@/lib/actions/users.actions";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UserButton = async ({ locale }: { locale: string }) => {
  const session = await auth();
  if (!session) {
    return (
      <SignInButton locale={locale}>
        <UserIcon /> {locale === "en" ? "Sign In" : "تسجيل الدخول"}
      </SignInButton>
    );
  }

  const firstInitial = session.user?.name?.charAt(0).toUpperCase() ?? "U";
  return (
    <div className="flex gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              className={
                "relative w-8 h-8 rounded-full ms-2 flex items-center justify-center bg-gray-200"
              }
              variant={"ghost"}
            >
              {firstInitial}
            </Button>
          }
        ></DropdownMenuTrigger>

        <DropdownMenuContent className={"w-56"} align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel className={"font-normal"}>
              <div className="flex flex-col space-y-1">
                <div className="text-sm font-medium leading-none">
                  {session.user?.name}
                </div>
                <div className="text-sm text-muted-foreground leading-none">
                  {session.user?.email}
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuItem className={"p-0 mb-1 "}>
              <form action={signOutUser} className="flex my-2">
                <Button
                  className={"w-full py-4 px-2 h-4 justify-start"}
                  variant={"ghost"}
                  type="submit"
                > <LogOut className="me-2" /> {locale === "en" ? "Sign Out" : "تسجيل الخروج"}</Button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;
