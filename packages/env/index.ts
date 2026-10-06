export const env = {
    clerk: {
        publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!,
        secretKey: process.env.CLERK_SECRET_KEY!,
        webhookSecretKey: process.env.CLERK_WEBHOOK_SECRET_KEY!,
    },
    env: process.env.NEXT_PUBLIC_APP_ENV!,

    mongodb: {
        uri: process.env.MONGODB_URI!,
        encryptionKey: process.env.MONGODB_ENCRYPTION_KEY,
    },

    aws: {
        region: process.env.AWS_REGION!,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        bucketName: process.env.AWS_BUCKET_NAME!,
    },
}

export const IS_DEVELOPMENT = env.env == "development"
export const IS_STAGING = env.env == "staging"
export const IS_PRODUCTION = env.env == "production"