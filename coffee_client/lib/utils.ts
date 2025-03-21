import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const contractAddress = "0x79f54161F4C7eD0A99b87F1be9E0835C18bcf9CF"