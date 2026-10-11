"use client"

import { usePathname } from "next/navigation"

export function useActivePartnerId() {
    const pathname = usePathname()
    const match = pathname.match(/\/partners\/partner\/([^/?#]+)/)
    return match ? decodeURIComponent(match[1]) : null
}