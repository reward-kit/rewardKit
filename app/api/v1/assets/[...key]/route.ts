import { auth } from "@clerk/nextjs/server"
import { isKeyOwnedBy, s3StorageService, STORAGE_NAMESPACE } from "@rewardkit/packages/infra/aws/s3Storage"

// Favicons are public (they show on the affiliate portal); everything else needs an owner check
const PUBLIC_KEY = new RegExp(`^orgs/[A-Za-z0-9_-]+/${STORAGE_NAMESPACE.FAVICON}/[A-Za-z0-9_.-]+$`)

export async function GET(_req: Request, { params }: { params: Promise<{ key: string[] }> }) {
    const key = (await params).key.join("/")
    const isPublic = PUBLIC_KEY.test(key)

    if (!isPublic) {
        const { userId, orgId } = await auth()
        if (!userId) return new Response("Unauthorized", { status: 401 })

        const owned = (orgId && isKeyOwnedBy(key, { orgId })) || isKeyOwnedBy(key, { userId })
        if (!owned) return new Response("Forbidden", { status: 403 })
    }

    const file = await s3StorageService.getObject(key)
    if (!file) return new Response("Not found", { status: 404 })

    return new Response(new Uint8Array(file.body), {
        headers: {
            "Content-Type": file.contentType ?? "application/octet-stream",
            "X-Content-Type-Options": "nosniff",
            // keys contain a UUID, so a given URL never changes content
            "Cache-Control": isPublic ? "public, max-age=31536000, immutable" : "private, max-age=3600",
        },
    })
}