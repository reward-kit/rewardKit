// 32 chars = exactly 5 bits each, so no rejection sampling and no bias.
// Skips i, l, o, u to avoid look-alikes (1/l/i, 0/o).
const ALPHABET = "0123456789abcdefghjkmnpqrstvwxyz"

const POOL_SIZE = 2048
const pool = new Uint8Array(POOL_SIZE)
let offset = POOL_SIZE // forces a refill on first use

const PREFIX_RE = /^[a-z]{2,6}$/

export const ID_PREFIXES = {
    request: 'req'
} as const

export type IdPrefix = (typeof ID_PREFIXES)[keyof typeof ID_PREFIXES]

export function generateId(prefix: IdPrefix | (string & {}), length = 26): string {
    if (!PREFIX_RE.test(prefix)) {
        throw new Error(`Invalid ID prefix: "${prefix}"`)
    }

    if (offset + length > POOL_SIZE) {
        crypto.getRandomValues(pool)
        offset = 0
    }

    let out = prefix + "_"
    for (let i = 0; i < length; i++) {
        out += ALPHABET[pool[offset++] & 31]
    }
    return out
}