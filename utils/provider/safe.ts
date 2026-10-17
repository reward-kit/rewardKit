/**
 * Runs an async function and returns its result, or null if it throws.
 * Use when the caller only cares about success vs failure and errors are
 * already handled elsewhere (e.g. a mutation's onError toast).
 */
export const safeAsync = async <T>(fn: () => Promise<T>): Promise<T | null> => {
    try {
        return await fn()
    } catch {
        return null
    }
}