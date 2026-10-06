// packages/features/program/services/favicon.service.ts
import { createElement } from "react"
import { ImageResponse } from "next/og"
import { getAvatarColor, getInitial } from "@rewardkit/lib/hashColor"
import { isKeyOwnedBy, s3StorageService, STORAGE_NAMESPACE } from "@rewardkit/packages/infra/aws/s3Storage"

const CONFIG = {
    size: 128,
    maxBytes: 256 * 1024,
    timeoutMs: 5_000,
} as const

const PNG = { contentType: "image/png", extension: "png" } as const
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47])

export type FaviconFile = { body: Buffer } & typeof PNG
export type FaviconSource = "website" | "generated"

export interface FaviconInput {
    orgId: string
    websiteUrl: string
    name: string
}

const toFile = (body: Buffer): FaviconFile => ({ body, ...PNG })

export class FaviconService {
    /** "acme.com", "https://www.acme.com/pricing" -> "www.acme.com". Null if it isn't a valid URL. */
    getHostname(websiteUrl: string): string | null {
        try {
            return new URL(/^https?:\/\//i.test(websiteUrl) ? websiteUrl : `https://${websiteUrl}`).hostname
        } catch {
            return null
        }
    }

    /** The site's favicon as a PNG, or null if it has none. Never throws. */
    async fetchFromWebsite(websiteUrl: string): Promise<FaviconFile | null> {
        const hostname = this.getHostname(websiteUrl)
        if (!hostname) return null

        try {
            const res = await fetch(
                `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=${CONFIG.size}`,
                { signal: AbortSignal.timeout(CONFIG.timeoutMs) }
            )

            // Google serves its generic globe with a 404 when the site has no favicon
            if (!res.ok) {
                await res.body?.cancel()
                return null
            }

            const body = Buffer.from(await res.arrayBuffer())
            if (body.byteLength > CONFIG.maxBytes || !body.subarray(0, 4).equals(PNG_SIGNATURE)) return null

            return toFile(body)
        } catch {
            return null
        }
    }

    /** Rounded square in the avatar color with the first letter. The same name gives the same image. */
    async generate(name: string): Promise<FaviconFile> {
        const { background, foreground } = getAvatarColor(name)

        // The bundled font is Latin only, so other scripts would render as an empty box
        const initial = getInitial(name)
        const letter = /^[A-Z0-9]$/.test(initial) ? initial : "U"

        const image = new ImageResponse(
            createElement(
                "div",
                {
                    style: {
                        width: CONFIG.size,
                        height: CONFIG.size,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background,
                        color: foreground,
                        fontSize: 72,
                        borderRadius: 24,
                    },
                },
                letter
            ),
            { width: CONFIG.size, height: CONFIG.size }
        )

        return toFile(Buffer.from(await image.arrayBuffer()))
    }

    /** The site's favicon, or a generated letter icon if it has none. Doesn't store anything. */
    async resolve({ websiteUrl, name }: Pick<FaviconInput, "websiteUrl" | "name">): Promise<{
        file: FaviconFile
        source: FaviconSource
    }> {
        const fetched = await this.fetchFromWebsite(websiteUrl)
        return fetched ? { file: fetched, source: "website" } : { file: await this.generate(name), source: "generated" }
    }

    /** Resolves a favicon and uploads it to S3. Returns the key to store as the program's faviconUrl. */
    async save(input: FaviconInput): Promise<{ key: string; source: FaviconSource }> {
        const { file, source } = await this.resolve(input)

        const { key } = await s3StorageService.upload({
            owner: { orgId: input.orgId },
            namespace: STORAGE_NAMESPACE.FAVICON,
            fileName: `favicon.${file.extension}`,
            body: file.body,
            contentType: file.contentType,
            allowedContentTypes: [PNG.contentType],
            maxBytes: CONFIG.maxBytes,
        })

        return { key, source }
    }

    /** For when the website or name changes: saves the new favicon, then deletes the old one. */
    async replace(input: FaviconInput & { previousKey?: string }): Promise<{ key: string; source: FaviconSource }> {
        const saved = await this.save(input)

        const { previousKey, orgId } = input
        if (previousKey && previousKey !== saved.key && isKeyOwnedBy(previousKey, { orgId })) {
            await s3StorageService.delete(previousKey).catch((err) =>
                console.error("[FaviconService.replace] failed to delete old favicon", err)
            )
        }

        return saved
    }
}

export const faviconService = new FaviconService()