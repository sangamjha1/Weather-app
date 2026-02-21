const CACHE_TTL_MS = 10 * 60 * 1000;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 30;

// In-memory stores (per serverless instance)
const weatherCache = globalThis.__weatherCache || new Map();
globalThis.__weatherCache = weatherCache;

const requestBuckets = globalThis.__weatherRateLimit || new Map();
globalThis.__weatherRateLimit = requestBuckets;

function getClientIp(req) {
    const forwarded = req.headers["x-forwarded-for"];
    if (typeof forwarded === "string" && forwarded.length) {
        return forwarded.split(",")[0].trim();
    }
    return req.headers["x-real-ip"] || "unknown";
}

function enforceRateLimit(req, res) {
    const ip = getClientIp(req);
    const now = Date.now();
    const bucket = requestBuckets.get(ip);

    if (!bucket || now - bucket.windowStart >= RATE_LIMIT_WINDOW_MS) {
        requestBuckets.set(ip, { count: 1, windowStart: now });
        return false;
    }

    if (bucket.count >= RATE_LIMIT_MAX_REQUESTS) {
        const retryAfter = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - bucket.windowStart)) / 1000);
        res.setHeader("Retry-After", String(retryAfter));
        return true;
    }

    bucket.count += 1;
    requestBuckets.set(ip, bucket);
    return false;
}

function readCache(key) {
    const cached = weatherCache.get(key);
    if (!cached) return null;

    if (Date.now() > cached.expiresAt) {
        weatherCache.delete(key);
        return null;
    }
    return cached.data;
}

function writeCache(key, data) {
    weatherCache.set(key, {
        data,
        expiresAt: Date.now() + CACHE_TTL_MS
    });
}

export default async function handler(req, res) {

    const { city, lat, lon, type } = req.query;
    const API_KEY = process.env.OPENWEATHER_API_KEY;

    let url = "";
    let cacheKey = "";

    try {
        if (!API_KEY) {
            return res.status(500).json({ error: "Missing OPENWEATHER_API_KEY" });
        }
        if (enforceRateLimit(req, res)) {
            return res.status(429).json({ error: "Too many requests. Please try again shortly." });
        }

        // Current weather by city
        if (type === "city") {
            if (!city) return res.status(400).json({ error: "Missing city" });
            url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
            cacheKey = `city:${String(city).trim().toLowerCase()}`;
        }

        // Current weather by coordinates
        else if (type === "coords") {
            if (!lat || !lon) return res.status(400).json({ error: "Missing coordinates" });
            url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
            cacheKey = `coords:${lat},${lon}`;
        }

        // Air Quality
        else if (type === "air") {
            if (!lat || !lon) return res.status(400).json({ error: "Missing coordinates" });
            url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
            cacheKey = `air:${lat},${lon}`;
        } else {
            return res.status(400).json({ error: "Invalid type" });
        }

        const cachedData = readCache(cacheKey);
        if (cachedData) {
            res.setHeader("X-Cache", "HIT");
            return res.status(200).json(cachedData);
        }

        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            writeCache(cacheKey, data);
        }
        res.setHeader("X-Cache", "MISS");
        res.status(response.status).json(data);

    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
}
