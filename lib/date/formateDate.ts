// packages/lib/date/formateDate.ts

export const DATE_FORMATS = {
    // Oct 11, 2026
    MMM_DD_YYYY: "{MMM} {D}, {YYYY}",
    // October 11, 2026
    MMMM_DD_YYYY: "{MMMM} {D}, {YYYY}",
    // 11 Oct 2026
    DD_MMM_YYYY: "{D} {MMM} {YYYY}",
    // 11 October 2026
    DD_MMMM_YYYY: "{D} {MMMM} {YYYY}",
    // Sun, Oct 11, 2026
    ddd_MMM_DD_YYYY: "{ddd}, {MMM} {D}, {YYYY}",
    // Sunday, October 11, 2026
    dddd_MMMM_DD_YYYY: "{dddd}, {MMMM} {D}, {YYYY}",
    // Oct 11
    MMM_DD: "{MMM} {D}",
    // October 2026
    MMMM_YYYY: "{MMMM} {YYYY}",
    // 11/10/2026
    DD_MM_YYYY: "{DD}/{MM}/{YYYY}",
    // 10/11/2026
    MM_DD_YYYY: "{MM}/{DD}/{YYYY}",
    // 2026-10-11
    YYYY_MM_DD: "{YYYY}-{MM}-{DD}",
    // 08:18 PM
    TIME: "{hh}:{mm} {A}",
    // Oct 11, 2026, 08:18 PM
    MMM_DD_YYYY_TIME: "{MMM} {D}, {YYYY}, {hh}:{mm} {A}",
    // October 11, 2026 at 08:18 PM
    MMMM_DD_YYYY_TIME: "{MMMM} {D}, {YYYY} at {hh}:{mm} {A}",
} as const;

export type DateFormat = keyof typeof DATE_FORMATS;

type FormatOptions = {
    /** "local" = viewer's timezone (default), "utc" = show the UTC date as-is, or any IANA zone like "Asia/Kolkata" */
    timeZone?: "local" | "utc" | (string & {});
    /** returned when the input is empty or invalid */
    fallback?: string;
};

const partsFormatters = new Map<string, Intl.DateTimeFormat>();

function getFormatter(timeZone: string | undefined) {
    const key = timeZone ?? "local";
    let f = partsFormatters.get(key);
    if (!f) {
        f = new Intl.DateTimeFormat("en-US", {
            timeZone,
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
        partsFormatters.set(key, f);
    }
    return f;
}

export function formatDate(
    value: string | Date | null | undefined,
    format: DateFormat | (string & {}), // a preset name, or your own template like "{MMM} {D}"
    { timeZone = "local", fallback = "—" }: FormatOptions = {},
): string {
    if (!value) return fallback;

    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return fallback;

    const tz = timeZone === "local" ? undefined : timeZone === "utc" ? "UTC" : timeZone;

    const p: Record<string, string> = {};
    for (const part of getFormatter(tz).formatToParts(date)) p[part.type] = part.value;

    const monthIndex = new Date(`${p.month} 1, 2000`).getMonth() + 1;

    const tokens: Record<string, string> = {
        YYYY: p.year,
        YY: p.year.slice(-2),
        MMMM: p.month,
        MMM: p.month.slice(0, 3),
        MM: String(monthIndex).padStart(2, "0"),
        D: p.day,
        DD: p.day.padStart(2, "0"),
        dddd: p.weekday,
        ddd: p.weekday.slice(0, 3),
        hh: p.hour.padStart(2, "0"),
        mm: p.minute,
        A: p.dayPeriod,
    };

    const template = format in DATE_FORMATS ? DATE_FORMATS[format as DateFormat] : format;
    return template.replace(/\{(\w+)\}/g, (_, token) => tokens[token] ?? `{${token}}`);
}