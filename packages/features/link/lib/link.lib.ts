import { stripProtocol } from "@rewardkit/lib/http-url"
import type { LinkStats } from "@rewardkit/packages/types/link/link.api.schema"
import { URL_PARAMETER, UrlParameter } from "@rewardkit/packages/types/program/program.schema"

// Where the partner's tracking link points. Kept in one place so the server
// (which builds `url`) and any future client helper stay in sync.
type LinkUrlSource = {
    websiteUrl?: string | null
    subdomain?: string | null
    urlParams?: string[] | null
}

/** Every parameter a link may use: the program's allowed ones, or all of them when unset. */
export function allowedUrlParams(urlParams?: UrlParameter[] | null): UrlParameter[] {
    return urlParams?.length ? urlParams : Object.values(URL_PARAMETER)
}

/**
 * Picks the parameter a link should use. Falls back to the first allowed one
 * (or `ref`) so a link is always renderable, even for legacy rows.
 */
export function resolveUrlParam(requested: UrlParameter | null | undefined, urlParams?: UrlParameter[] | null): string {
    const allowed = allowedUrlParams(urlParams)
    if (requested && allowed.includes(requested)) return requested
    return allowed[0] ?? URL_PARAMETER.REF
}

export function buildLinkUrl(
    source: LinkUrlSource | null | undefined,
    code: string,
    urlParam?: string | null,
): string {
    const host = stripProtocol(source?.websiteUrl)
    // preferred: the program's website with the chosen parameter, e.g. https://acme.com/?aff=jane-4f2a
    if (host) return `https://${host}/?${urlParam ?? URL_PARAMETER.REF}=${code}`
    // fallback: the program's own subdomain, e.g. https://acme.rewardkit.app/jane-4f2a
    if (source?.subdomain) return `https://${source.subdomain}/${code}`
    return code
}

const CODE_ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789"

const slugify = (value: string) =>
    value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 20)

/** Suggests a code like "jane-doe-4f2a" that always satisfies the DB regex. */
export function generateLinkCode(name: string): string {
    const base = slugify(name) || "link"
    let suffix = ""
    for (let i = 0; i < 4; i++) {
        suffix += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)]
    }
    return `${base}-${suffix}`
}

/* --------------------------- dummy metrics --------------------------- */
/* Deterministic pseudo stats so a link's numbers stay put across refetches.
   Replace with real aggregations once tracking lands. */

function hash(seed: string): number {
    let h = 2166136261
    for (let i = 0; i < seed.length; i++) {
        h ^= seed.charCodeAt(i)
        h = Math.imul(h, 16777619)
    }
    return h >>> 0
}

export function linkStatsFromSeed(seed: string): LinkStats {
    const h = hash(seed)
    const clicks = 50 + (h % 5000)
    const leads = Math.round(clicks * (0.1 + ((h >>> 3) % 20) / 100))      // 10-30% of clicks
    const customers = Math.round(leads * (0.2 + ((h >>> 5) % 40) / 100))   // 20-60% of leads
    const revenue = customers * (2000 + ((h >>> 7) % 8000))                // $20-$100 per customer (cents)
    const commission = Math.round(revenue * 0.2)                           // 20% of revenue
    return { clicks, leads, customers, revenue, commission }
}
