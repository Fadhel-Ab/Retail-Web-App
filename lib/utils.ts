import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
// override tailwind default styles with custom ones
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// convert prisma object to regular object
export function toPlainObject<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
