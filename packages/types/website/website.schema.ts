import { z } from "zod"

const MAX_LENGTH = 2048

// labels of 1-63 chars, at least one dot, and a letters-only (or punycode) TLD.
// This rejects IPs, "localhost" and bare words like "acme"
const HOSTNAME =
    /^(?=.{4,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+([a-z]{2,63}|xn--[a-z0-9-]{1,59})$/

const BLOCKED_TLDS = new Set(["local", "localhost", "internal", "test", "example", "invalid", "lan"])

/** What the user typed -> a full https URL. "acme.com" and "http://acme.com" both become "https://acme.com". */
export const normalizeWebsiteUrl = (input: string): string => {
    const trimmed = input.trim()
    return trimmed ? `https://${trimmed.replace(/^https?:\/\//i, "")}` : ""
}

export const ZWebsiteUrl = z
    .string()
    .trim()
    .min(1, "Enter your website")
    .max(MAX_LENGTH, "That URL is too long")
    .superRefine((value, ctx) => {
        const fail = (message: string) => ctx.addIssue({ code: "custom", message })

        let url: URL
        try {
            url = new URL(value)
        } catch {
            return fail("Enter a valid website, like acme.com")
        }

        if (url.protocol !== "https:") return fail("Website must start with https://")
        if (url.username || url.password) return fail("URL can't contain a username or password")
        if (url.port) return fail("Custom ports aren't supported")

        // url.hostname is lowercase, and IDN domains arrive as punycode
        if (!HOSTNAME.test(url.hostname) || BLOCKED_TLDS.has(url.hostname.split(".").pop()!)) {
            return fail("Enter a valid domain, like acme.com")
        }
    })