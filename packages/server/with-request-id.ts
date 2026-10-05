// packages/api/with-request-id.ts

import { runWithRequestId } from "./utils/request-context"

export function withRequestId<A extends unknown[]>(
    handler: (req: Request, ...args: A) => Promise<Response>
) {
    return (req: Request, ...args: A): Promise<Response> =>
        runWithRequestId(req, async (requestId) => {
            const res = await handler(req, ...args)
            res.headers.set("x-request-id", requestId)
            return res
        })
}