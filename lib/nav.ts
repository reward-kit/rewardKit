/**
 * Normalizes a path: removes query/hash and trailing slashes.
 * "/w/partners/"  -> "/w/partners"
 * "/w"            -> "/w"
 */
const normalizePath = (path: string): string => {
    const clean = path.split("?")[0].split("#")[0]
    const trimmed = clean.replace(/\/+$/, "")
    return trimmed === "" ? "/" : trimmed
}

/**
 * Exact-match active check, so only one nav item highlights at a time.
 *
 * On "/w"           -> Home is active
 * On "/w/partners"  -> Partners is active
 */
export const isNavItemActive = (pathname: string, href: string): boolean => {
    return normalizePath(pathname) === normalizePath(href)
}