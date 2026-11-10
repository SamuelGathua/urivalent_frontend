import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

const hasRedisEnv = Boolean(url) && Boolean(token);

// Strict Limit: 3 requests per 48 hours
export const ratelimit = hasRedisEnv
  ? new Ratelimit({
      redis: new Redis({ url, token }),
      limiter: Ratelimit.slidingWindow(3, "48 h"),
      analytics: true,
    })
  : {
      limit: async () => ({
        success: true,
        limit: 3,
        remaining: 3,
        reset: Date.now() + 48 * 60 * 60 * 1000,
        pending: Promise.resolve(),
      }),
    };
