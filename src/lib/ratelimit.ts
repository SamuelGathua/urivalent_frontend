import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

function getRatelimitInstance(): Ratelimit | null {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

  if (!url || !token) {
    return null;
  }

  try {
    // Reference environment variables properly via Redis.fromEnv()
    return new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(3, "48 h"),
      analytics: true,
    });
  } catch (err) {
    console.error("[ratelimit] Failed to initialize Redis via fromEnv():", err);
    return null;
  }
}

let cachedRatelimit: Ratelimit | null = null;

/**
 * Checks rate limit with graceful degradation.
 * If Redis keys are missing or the connection fails, throws an explicit error
 * allowing API routes to return a clean 500 "Rate limiter unavailable" without crashing the server.
 */
export async function checkRateLimit(identifier: string): Promise<{ success: boolean }> {
  if (!cachedRatelimit) {
    cachedRatelimit = getRatelimitInstance();
  }

  if (!cachedRatelimit) {
    throw new Error("Rate limiter unavailable: UPSTASH_REDIS environment variables missing");
  }

  try {
    const result = await cachedRatelimit.limit(identifier);
    if (result.reason === "timeout") {
      throw new Error("Rate limiter unavailable: Upstash Redis connection timed out");
    }
    return { success: result.success };
  } catch (err) {
    console.error("[ratelimit] Upstash Redis connection error:", err);
    throw new Error("Rate limiter unavailable: Upstash Redis connection failed");
  }
}

export const ratelimit = {
  limit: async (identifier: string) => checkRateLimit(identifier),
};
