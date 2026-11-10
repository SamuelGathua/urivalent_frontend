import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const hasRedisEnv =
  Boolean(process.env.UPSTASH_REDIS_REST_URL) &&
  Boolean(process.env.UPSTASH_REDIS_REST_TOKEN);

// Strict Limit: 3 requests per 48 hours
export const ratelimit = hasRedisEnv
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(3, "48 h"),
      analytics: true,
    })
  : {
      limit: async (_identifier: string) => ({
        success: true,
        limit: 3,
        remaining: 3,
        reset: Date.now() + 48 * 60 * 60 * 1000,
        pending: Promise.resolve(),
      }),
    };

