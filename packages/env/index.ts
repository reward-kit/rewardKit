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
}

export const IS_DEVELOPMENT = env.env == "development"