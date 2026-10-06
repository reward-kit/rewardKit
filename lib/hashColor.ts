// Deterministic "identicon" style color for avatar fallbacks.
// The same seed (e.g. a vendor name) always maps to the same color and
// initial, so it stays stable across refreshes/re-renders without needing
// to persist anything.

const AVATAR_PALETTE = [
    "#EF4444", // red
    "#F97316", // orange
    "#F59E0B", // amber
    "#84CC16", // lime
    "#10B981", // emerald
    "#14B8A6", // teal
    "#06B6D4", // cyan
    "#3B82F6", // blue
    "#6366F1", // indigo
    "#8B5CF6", // violet
    "#D946EF", // fuchsia
    "#EC4899", // pink
] as const;

function hashString(input: string): number {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        hash = (hash << 5) - hash + input.charCodeAt(i);
        hash |= 0; // keep it a 32-bit int
    }
    return Math.abs(hash);
}

export interface AvatarColor {
    background: string;
    foreground: string;
}

/**
 * Returns a stable background/foreground pair for a given seed string.
 * Same seed in -> same color out, every time.
 */
export function getAvatarColor(seed?: string | null): AvatarColor {
    const normalized = (seed ?? "").trim().toLowerCase() || "?";
    const index = hashString(normalized) % AVATAR_PALETTE.length;

    return {
        background: AVATAR_PALETTE[index]!,
        foreground: "#FFFFFF",
    };
}

/** First letter of a name, uppercased, with a safe fallback. */
export function getInitial(name?: string | null): string {
    const trimmed = name?.trim();
    return trimmed ? trimmed.charAt(0).toUpperCase() : "S";
}
