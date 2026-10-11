import { RESERVED_SUBDOMAINS } from "@rewardkit/packages/features/program/lib/reserved-subdomains"



export const SUBDOMAIN_MIN = 3
export const SUBDOMAIN_MAX = 63

// turns a product name into a suggested subdomain
export const toSubdomain = (value: string) =>
    value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, SUBDOMAIN_MAX)
        .replace(/-+$/g, "")

// for forms: returns an error message, or null when valid
export const validateSubdomain = (value: string): string | null => {
    if (!value) return "Enter a subdomain"
    if (value.length < SUBDOMAIN_MIN) return `Use at least ${SUBDOMAIN_MIN} characters`
    if (value.length > SUBDOMAIN_MAX) return `Use ${SUBDOMAIN_MAX} characters or fewer`
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
        return "Use lowercase letters, numbers, and single hyphens between words"
    }
    if (RESERVED_SUBDOMAINS.has(value)) return "This subdomain is reserved. Pick another."
    return null
}

// for the server: normalizes first, then reuses the same rules
export function parseSubdomain(raw: string):
    | { ok: true; slug: string }
    | { ok: false; reason: "taken" | "reserved"; message: string } {
    const slug = raw.trim().toLowerCase()
    const message = validateSubdomain(slug)
    if (!message) return { ok: true, slug }
    return { ok: false, reason: RESERVED_SUBDOMAINS.has(slug) ? "reserved" : "taken", message }
}