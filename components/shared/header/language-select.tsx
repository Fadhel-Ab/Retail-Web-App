"use client";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { getLocaleName, getLocalizedUrl, Locales } from "intlayer";
import { useLocale } from "next-intlayer";
import { useState } from "react";
import Link from "next/link";
import { Globe } from "lucide-react";


export const LocaleSwitcher = () => {
  const { locale, pathWithoutLocale, availableLocales, setLocale } =
    useLocale();
  const [open, setOpen] = useState(false);
  const [clicked, setClicked] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" onClick={() => setClicked(!clicked)}>
            <Globe className="ms-2" />
            {locale === Locales.ENGLISH ? "Language" : "اللغة"}
          </Button>
        }
      ></DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-base">
            {locale === Locales.ENGLISH ? "Language" : "اللغة"}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            render={
              <Link
                href={getLocalizedUrl(pathWithoutLocale, Locales.ARABIC)}
              ></Link>
            }
            checked={locale === Locales.ARABIC}
            onClick={() => {
              setOpen(false);
            }}
          >
            {getLocaleName(Locales.ARABIC)}
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            render={
              <Link
                href={getLocalizedUrl(pathWithoutLocale, Locales.ENGLISH)}
              ></Link>
            }
            checked={locale === Locales.ENGLISH}
            onClick={() => {
              setOpen(false);
            }}
          >
            {getLocaleName(Locales.ENGLISH)}
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  /* another way 
  return (
  <div className="relative inline-block">
    <select
      className="
        appearance-none
        bg-white
        border border-gray-300
        text-gray-700
        py-2 pl-3 pr-8
        rounded-lg
        shadow-sm
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
        focus:border-blue-500
        cursor-pointer
        transition
      "
      value={locale}
      onChange={(e) =>
        setLocale(availableLocales[e.target.selectedIndex])
      }
    >
      <option value={Locales.ENGLISH}>English</option>
      <option value={Locales.ARABIC}>العربية</option>
    </select>

{dropdown arrow}
    <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-500">
      ▼
    </div>
  </div>
);*/
};
