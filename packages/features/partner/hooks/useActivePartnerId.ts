"use client"

import { usePathname } from "next/navigation"

const PARTNER_PATH_REGEX = /\/partners\/partner\/([^/]+)/

export function useActivePartnerId(): string | null {
  const pathname = usePathname()
  const match = pathname?.match(PARTNER_PATH_REGEX)
  return match ? decodeURIComponent(match[1]) : null
}