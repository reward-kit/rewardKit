import { generateId } from "@rewardkit/lib/id/generateId"
import { AsyncLocalStorage } from "node:async_hooks"

const storage = new AsyncLocalStorage<{ requestId: string }>()
const SAFE_REQUEST_ID = /^[\w-]{8,64}$/

export function runWithRequestId<T>(req: Request, fn: (requestId: string) => T): T {
    const incoming = req.headers.get("x-request-id")
    // Client-sent IDs are untrusted: accept only a safe shape, else generate our own
    const requestId = incoming && SAFE_REQUEST_ID.test(incoming) ? incoming : generateId("req")
    return storage.run({ requestId }, () => fn(requestId))
}

export const getRequestId = () => storage.getStore()?.requestId