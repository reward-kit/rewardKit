// @rewardkit/lib/trpc-error.ts
export function getTrpcErrorMessage(error: unknown): string | undefined {
    const message = (error as { message?: string } | null)?.message
    if (!message) return undefined

    try {
        const issues = JSON.parse(message)
        if (Array.isArray(issues) && issues[0]?.message) return issues[0].message as string
    } catch {
        // not JSON, so it's already a readable message
    }
    return message
}