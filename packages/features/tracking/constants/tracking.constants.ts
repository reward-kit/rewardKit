// Client cookie the tracking script uses to remember a visitor between visits.
export const TRACKING_COOKIE_NAME = "rk_visitor_id";

// Default query params the script looks for. The per-program list lives on
// program.urlParams; this is the fallback for the client-side script.
export const DEFAULT_URL_PARAMS = ["ref", "via", "referral_code"] as const;

// User-agent substrings that mark a request as a bot (skipped for tracking).
export const BOT_USER_AGENT_PATTERNS = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /crawl/i,
    /slurp/i,
    /fetch/i,
    /preview/i,
    /monitor/i,
    /uptime/i,
    /headless/i,
    /lighthouse/i,
    /pingdom/i,
    /slackbot/i,
    /discordbot/i,
    /googlebot/i,
    /bingbot/i,
    /yandex/i,
    /baidu/i,
    /semrush/i,
    /ahrefs/i,
    /petalbot/i,
] as const;

// Per-IP, in-memory rate limit (per serverless instance / process). Swap for a
// shared store (Redis) before running multiple instances in production.
export const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
export const RATE_LIMIT_MAX_REQUESTS = 30; // max tracked requests per IP per window
