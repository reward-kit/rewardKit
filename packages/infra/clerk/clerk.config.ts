import { createClerkClient } from "@clerk/backend";
import { env } from '@rewardkit/packages/env';

/**
 * Clerk Client
 * 
 * Used for authentication and authorization
 * Credentials are resolved from environment variables
 */
export const clerk = createClerkClient({ secretKey: env.clerk.secretKey });
