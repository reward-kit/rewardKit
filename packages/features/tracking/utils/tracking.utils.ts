import {
    BOT_USER_AGENT_PATTERNS,
    RATE_LIMIT_MAX_REQUESTS,
    RATE_LIMIT_WINDOW_MS,
} from "../constants/tracking.constants";

/* ----------------------------- request metadata ----------------------------- */

export function extractIp(req: Request): string {
    const forwarded = req.headers.get("x-forwarded-for");
    const ip =
        forwarded?.split(",")[0]?.trim() ||
        req.headers.get("cf-connecting-ip") ||
        req.headers.get("x-real-ip") ||
        "";
    return ip || "unknown";
}

export function getCountryFromHeaders(req: Request): string | null {
    const country =
        req.headers.get("cf-ipcountry") ||
        req.headers.get("x-vercel-ip-country") ||
        req.headers.get("x-country-code");
    return country && /^[A-Z]{2}$/.test(country) ? country : null;
}

/* -------------------------------- bot filter -------------------------------- */

export function isBotUserAgent(userAgent?: string | null): boolean {
    if (!userAgent) return false;
    return BOT_USER_AGENT_PATTERNS.some((pattern) => pattern.test(userAgent));
}

/* ------------------------------- rate limiter ------------------------------- */
/* In-memory sliding window keyed by IP. Not shared across instances; a Redis
   store would replace this for a multi-instance deployment. */

const hits = new Map<string, { count: number; resetAt: number }>();

/** Returns true when this IP has exceeded the per-window budget. */
export function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = hits.get(ip);

    if (!entry || now >= entry.resetAt) {
        hits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
        // opportunistically prune stale buckets so the map can't grow unbounded
        if (hits.size > 10_000) {
            for (const [key, value] of hits) {
                if (now >= value.resetAt) hits.delete(key);
            }
        }
        return false;
    }

    if (entry.count >= RATE_LIMIT_MAX_REQUESTS) return true;
    entry.count += 1;
    return false;
}

/* ---------------------------- device / UA parsing --------------------------- */
/* Lightweight UA sniffing without a dependency. Good enough for the device
   columns; swap in ua-parser-js only if we need precise model strings. */

export type DeviceInfo = {
    deviceOs: string | null;
    deviceOsVersion: string | null;
    deviceManufacturer: string | null;
    deviceModel: string | null;
};

const OS_PATTERNS: Array<[RegExp, string]> = [
    [/\bwindows nt ([\d.]+)/i, "Windows"],
    [/\bios ([\d_]+)/i, "iOS"],
    [/\bandroid ([\d.]+)/i, "Android"],
    [/\bmac os x ([\d_.]+)/i, "macOS"],
    [/\bcros\b/i, "Chrome OS"],
    [/\blinux\b/i, "Linux"],
];

const DEVICE_PATTERNS: Array<[RegExp, string, string | null]> = [
    [/\biphone\b/i, "Apple", "iPhone"],
    [/\bipad\b/i, "Apple", "iPad"],
    [/\bipod\b/i, "Apple", "iPod"],
    [/\bmacintosh\b/i, "Apple", null],
    [/\bandroid\b.*\b(samsung|sm-)/i, "Samsung", null],
    [/\b(pixel|nexus)\b/i, "Google", null],
    [/\bhuawei\b/i, "Huawei", null],
    [/\bxiaomi\b|\bmiuibrowser\b/i, "Xiaomi", null],
    [/\bandroid\b/i, "Android", null],
];

export function parseUserAgent(userAgent?: string | null): DeviceInfo {
    const empty: DeviceInfo = {
        deviceOs: null,
        deviceOsVersion: null,
        deviceManufacturer: null,
        deviceModel: null,
    };
    if (!userAgent) return empty;

    let deviceOs: string | null = null;
    let deviceOsVersion: string | null = null;
    for (const [re, name] of OS_PATTERNS) {
        const match = userAgent.match(re);
        if (match) {
            deviceOs = name;
            if (match[1]) deviceOsVersion = match[1].replace(/_/g, ".").trim();
            break;
        }
    }

    let deviceManufacturer: string | null = null;
    let deviceModel: string | null = null;
    for (const [re, manufacturer, model] of DEVICE_PATTERNS) {
        if (re.test(userAgent)) {
            deviceManufacturer = manufacturer;
            deviceModel = model;
            break;
        }
    }

    return { deviceOs, deviceOsVersion, deviceManufacturer, deviceModel };
}

/* ----------------------------- origin validation ---------------------------- */

const toHost = (url?: string | null): string | null => {
    if (!url) return null;
    try {
        // tolerate values stored with or without a scheme
        const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(url) ? url : `https://${url}`;
        return new URL(withScheme).hostname.replace(/^www\./, "").toLowerCase();
    } catch {
        return null;
    }
};

/**
 * Validates an incoming Origin/Referer against the program's website and the
 * partner group's website. When neither is configured there is nothing to
 * compare against, so we allow the request rather than block all tracking.
 */
export function isAllowedOrigin(
    origin: string | null | undefined,
    allowedUrls: Array<string | null | undefined>,
): boolean {
    const originHost = toHost(origin);
    if (!originHost) return false;

    const hosts = allowedUrls
        .map(toHost)
        .filter((host): host is string => !!host);

    if (hosts.length === 0) return true; // nothing configured to enforce
    return hosts.includes(originHost);
}
