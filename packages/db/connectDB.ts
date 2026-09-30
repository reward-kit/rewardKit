import { env, IS_DEVELOPMENT } from "@rewardkit/packages/env";
import mongoose from "mongoose";

const uri = env.mongodb.uri!;
let mongoDb: any = null;

export async function connectDB() {
    if (mongoDb) return mongoDb;

    if (!uri) {
        console.error("DB_URL is not defined");
        throw new Error("DB_URL is not defined");
    }

    try {
        // Only apply local DNS fix in development environments
        if (IS_DEVELOPMENT) {
            const dns = await import("node:dns/promises");
            dns.setServers(["8.8.8.8", "8.8.4.4"]); // Bypasses local ISP/Windows DNS issues
        }

        // Connect cleanly (cloud run will use its native DNS & IP routing)
        await mongoose.connect(uri);

        const mongoClient = mongoose.connection.getClient();
        mongoDb = mongoClient.db();

        console.info("DB Connected");
        return mongoDb;
    } catch (err) {
        console.error(`DB Connection failed: ${err}`);
        throw err;
    }
}