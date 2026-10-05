import "server-only"
import { cookies } from "next/headers"

export type CookieOptions = {
    maxAge?: number
    expires?: Date
    path?: string
    domain?: string
    httpOnly?: boolean
    secure?: boolean
    sameSite?: "lax" | "strict" | "none"
}

const DEFAULT_OPTIONS: CookieOptions = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
}

export async function getCookie(name: string): Promise<string | undefined> {
    return (await cookies()).get(name)?.value
}

/** Returns false instead of throwing when cookies can't be written (e.g. server-component callers). */
export async function setCookie(
    name: string,
    value: string,
    options: CookieOptions = {}
): Promise<boolean> {
    try {
        ; (await cookies()).set(name, value, { ...DEFAULT_OPTIONS, ...options })
        return true
    } catch {
        return false
    }
}

export async function deleteCookie(name: string, options: Pick<CookieOptions, "path" | "domain"> = {}): Promise<boolean> {
    try {
        ; (await cookies()).delete({ name, path: "/", ...options })
        return true
    } catch {
        return false
    }
}

/** Declare a cookie once, then use it anywhere without repeating the name or options. */
export function defineCookie(name: string, baseOptions: CookieOptions = {}) {
    return {
        name,
        get: () => getCookie(name),
        set: (value: string, overrides: CookieOptions = {}) =>
            setCookie(name, value, { ...baseOptions, ...overrides }),
        delete: () => deleteCookie(name, baseOptions),
    }
}