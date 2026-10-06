// packages/lib/assetUrl.ts
/** Turns a stored S3 key into a URL the browser can load. Full URLs pass through unchanged. */
export const getAssetUrl = (key?: string | null): string | undefined => {
    if (!key) return undefined
    if (/^(https?:|data:|blob:)/i.test(key)) return key
    return `/api/v1/assets/${key.replace(/^\/+/, "")}`
}