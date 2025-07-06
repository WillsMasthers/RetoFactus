import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function cx(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Placeholder functions based on typical usage
export const focusInput =
  'focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
export const focusRing =
  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
export const hasErrorInput = 'border-red-500 text-red-500'
