import type { ZodType } from "zod";

export class ApiError extends Error {
    constructor(
        public status: number,
        message: string,
        public info?: unknown
    ) {
        super(message);
    }
}

export async function apiFetch<T>(
    url: string,
    init?: RequestInit,
    schema?: ZodType<T>
): Promise<T> {
    const res = await fetch(url, {
        ...init,
        headers: { "Content-Type": "application/json", ...init?.headers },
    });

    const body = await res.json().catch(() => null);

    if (!res.ok) {
        throw new ApiError(res.status, body?.message ?? res.statusText, body);
    }

    return schema ? schema.parse(body) : (body as T);
}