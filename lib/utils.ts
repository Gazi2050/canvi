import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(ts: number | Date | undefined): string {
  if (ts == null) return "—"
  const date = typeof ts === "number" ? new Date(ts) : ts
  return date.toLocaleDateString(undefined, { dateStyle: "long" })
}
