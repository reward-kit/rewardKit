// packages/infra/s3/s3.storage.ts
import { randomUUID } from "node:crypto"
import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    HeadObjectCommand,
    CopyObjectCommand,
    DeleteObjectCommand,
    ListObjectsV2Command,
    DeleteObjectsCommand 
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { env } from "@rewardkit/packages/env"

/** What kind of file it is. Becomes a folder in the key, so add new kinds here. */
export const STORAGE_NAMESPACE = {
    PROGRAM_ASSETS: "program-assets", // logos, banners, brand kit
    PARTNER_DOCUMENTS: "partner-documents", // tax forms, agreements
    PAYOUT_DOCUMENTS: "payout-documents", // statements, receipts
    EXPORTS: "exports", // CSV / report exports
    GENERAL: "general",
    FAVICON: "favicon"
} as const
export type StorageNamespace = (typeof STORAGE_NAMESPACE)[keyof typeof STORAGE_NAMESPACE]

/** Who owns the file. Org-scoped by default; user-scoped covers pre-org flows like onboarding. */
export type StorageOwner = { orgId: string } | { userId: string }

export interface UploadInput {
    owner: StorageOwner
    namespace: StorageNamespace
    fileName: string
    body: Buffer
    contentType: string
    /** Store under temp/ until the record that uses it is saved (see promoteTemp) */
    temp?: boolean
    cacheControl?: string
    maxBytes?: number
    allowedContentTypes?: readonly string[]
}

export interface UploadUrlInput {
    owner: StorageOwner
    namespace: StorageNamespace
    fileName: string
    contentType: string
    temp?: boolean
    expiresInSeconds?: number
}

export interface StoredFile {
    key: string
    contentType: string
    size: number
}

const BUCKET_NAME = env.aws.bucketName
const TEMP_PREFIX = "temp/"
const DEFAULT_MAX_BYTES = 10 * 1024 * 1024
const SAFE_SEGMENT = /^[A-Za-z0-9_-]+$/

export const s3Client = new S3Client({
    region: env.aws.region,
    credentials: {
        accessKeyId: env.aws.accessKeyId,
        secretAccessKey: env.aws.secretAccessKey,
    },
})

const ownerPrefix = (owner: StorageOwner): string => {
    const [kind, id] = "orgId" in owner ? ["orgs", owner.orgId] : ["users", owner.userId]
    if (!SAFE_SEGMENT.test(id)) throw new Error("Invalid storage owner id")
    return `${kind}/${id}`
}

const sanitizeFileName = (fileName: string): string => {
    const dot = fileName.lastIndexOf(".")
    const base = dot > 0 ? fileName.slice(0, dot) : fileName
    const ext = dot > 0 ? fileName.slice(dot) : ""

    const safeBase =
        base
            .normalize("NFKD")
            .replace(/[^A-Za-z0-9_-]+/g, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 80) || "file"
    const safeExt = ext.toLowerCase().replace(/[^.a-z0-9]/g, "").slice(0, 10)

    return safeBase + safeExt
}

/** orgs/{orgId}/{namespace}/{uuid}-{name}  (prefixed with temp/ for temporary files) */
const buildKey = ({
    owner,
    namespace,
    fileName,
    temp,
}: Pick<UploadInput, "owner" | "namespace" | "fileName" | "temp">): string =>
    `${temp ? TEMP_PREFIX : ""}${ownerPrefix(owner)}/${namespace}/${randomUUID()}-${sanitizeFileName(fileName)}`

/** True if the key lives under this owner's folder (permanent or temp). */
export const isKeyOwnedBy = (key: string, owner: StorageOwner): boolean => {
    if (key.includes("..")) return false
    const prefix = `${ownerPrefix(owner)}/`
    return key.startsWith(prefix) || key.startsWith(`${TEMP_PREFIX}${prefix}`)
}

export class S3StorageService {
    constructor(private readonly bucket: string = BUCKET_NAME) { }

    /** Server-side upload. */
    async upload(input: UploadInput): Promise<StoredFile> {
        const {
            body,
            contentType,
            temp = false,
            cacheControl = temp ? undefined : "private, max-age=31536000",
            maxBytes = DEFAULT_MAX_BYTES,
            allowedContentTypes,
        } = input

        if (body.byteLength > maxBytes) {
            throw new Error(`File is too large (max ${Math.round(maxBytes / 1024 / 1024)} MB)`)
        }
        if (allowedContentTypes && !allowedContentTypes.includes(contentType)) {
            throw new Error(`File type ${contentType} is not allowed`)
        }

        const key = buildKey(input)

        await s3Client.send(
            new PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: body,
                ContentType: contentType,
                CacheControl: cacheControl,
            })
        )

        return { key, contentType, size: body.byteLength }
    }

    /** Presigned PUT so the browser uploads straight to S3 without going through your server. */
    async createUploadUrl(input: UploadUrlInput): Promise<{ key: string; url: string }> {
        const { contentType, temp = true, expiresInSeconds = 300 } = input
        const key = buildKey({ ...input, temp })

        const url = await getSignedUrl(
            s3Client,
            new PutObjectCommand({ Bucket: this.bucket, Key: key, ContentType: contentType }),
            { expiresIn: expiresInSeconds }
        )

        return { key, url }
    }

    /** Moves a temp file to its permanent location (same key without the temp/ prefix). */
    async promoteTemp(sourceKey: string, owner: StorageOwner): Promise<{ key: string }> {
        if (!sourceKey.startsWith(TEMP_PREFIX) || !isKeyOwnedBy(sourceKey, owner)) {
            throw new Error("Invalid temporary file")
        }
        return this.move(sourceKey, sourceKey.slice(TEMP_PREFIX.length))
    }

    /** Copy + delete. */
    async move(sourceKey: string, destinationKey: string): Promise<{ key: string }> {
        const encodedSource = sourceKey.split("/").map(encodeURIComponent).join("/")

        await s3Client.send(
            new CopyObjectCommand({
                Bucket: this.bucket,
                CopySource: `${this.bucket}/${encodedSource}`,
                Key: destinationKey,
            })
        )
        await s3Client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: sourceKey }))

        return { key: destinationKey }
    }

    async download(key: string): Promise<Buffer> {
        const response = await s3Client.send(new GetObjectCommand({ Bucket: this.bucket, Key: key }))

        if (!response.Body) throw new Error(`S3 object body is empty for key: ${key}`)

        return Buffer.from(await response.Body.transformToByteArray())
    }

    /** Signed GET URL. Pass downloadAs to force a download with a friendly file name. */
    async getDownloadUrl(
        key: string,
        { expiresInSeconds = 3600, downloadAs }: { expiresInSeconds?: number; downloadAs?: string } = {}
    ): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: key,
            ...(downloadAs && {
                ResponseContentDisposition: `attachment; filename*=UTF-8''${encodeURIComponent(downloadAs)}`,
            }),
        })

        return getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds })
    }

    async exists(key: string): Promise<boolean> {
        try {
            await s3Client.send(new HeadObjectCommand({ Bucket: this.bucket, Key: key }))
            return true
        } catch (err: any) {
            if (err?.name === "NotFound" || err?.$metadata?.httpStatusCode === 404) return false
            throw err
        }
    }

    async delete(key: string): Promise<void> {
        await s3Client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }))
    }

    async getObject(key: string): Promise<{ body: Buffer; contentType?: string } | null> {
        try {
            const res = await s3Client.send(new GetObjectCommand({ Bucket: this.bucket, Key: key }))
            if (!res.Body) return null
            return { body: Buffer.from(await res.Body.transformToByteArray()), contentType: res.ContentType }
        } catch (err: any) {
            if (err?.name === "NoSuchKey" || err?.$metadata?.httpStatusCode === 404) return null
            throw err
        }
    }

    async deleteAllForOwner(owner: StorageOwner): Promise<number> {
        const base = `${ownerPrefix(owner)}/` // validated, always ends with "/"
        let deleted = 0

        for (const prefix of [base, `${TEMP_PREFIX}${base}`]) {
            let token: string | undefined
            do {
                const list = await s3Client.send(
                    new ListObjectsV2Command({ Bucket: this.bucket, Prefix: prefix, ContinuationToken: token })
                )
                const objects = (list.Contents ?? []).map((o) => ({ Key: o.Key! }))

                if (objects.length) {
                    const res = await s3Client.send(
                        new DeleteObjectsCommand({ Bucket: this.bucket, Delete: { Objects: objects, Quiet: true } })
                    )
                    if (res.Errors?.length) throw new Error(`Failed to delete ${res.Errors.length} files`)
                    deleted += objects.length
                }
                token = list.IsTruncated ? list.NextContinuationToken : undefined
            } while (token)
        }
        return deleted
    }
}

export const s3StorageService = new S3StorageService()