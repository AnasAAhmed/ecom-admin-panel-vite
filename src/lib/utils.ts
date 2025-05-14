import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const pageTitle = (title: string) => {
  return title
    .replace(/\//g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word
};
