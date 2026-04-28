
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { number } from "zod";

// override tailwind default styles with custom ones
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// convert prisma object to regular object
export function toPlainObject<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// format number with decimal places
export function formatNumberWithDecimal(num: string): string {
  const [int, decimal] = num.split(".");
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
}

export function round2(value: number | string) {
  if (typeof value ==='number') {
    return Math.round((value+Number.EPSILON)*100) / 100;
  }else if(typeof value ==='string') {
return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  }else {
    throw new Error('Value is not a number or a string');
  }

}