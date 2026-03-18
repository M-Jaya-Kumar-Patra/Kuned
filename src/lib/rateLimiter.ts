type RateLimitEntry = {
  count: number;
  time: number;
};

const requests = new Map<string, RateLimitEntry>();

const WINDOW_TIME = 60 * 1000; // 1 minute
const MAX_REQUESTS = 20;

export function rateLimiter(ip: string) {

  const now = Date.now();
  const entry = requests.get(ip);

  if (!entry) {
    requests.set(ip, { count: 1, time: now });
    return true;
  }

  if (now - entry.time > WINDOW_TIME) {
    requests.set(ip, { count: 1, time: now });
    return true;
  }

  if (entry.count >= MAX_REQUESTS) {
    return false;
  }

  entry.count++;
  return true;
}