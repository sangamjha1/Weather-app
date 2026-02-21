export default async function handler(req, res) {

    const { city, lat, lon, type } = req.query;
    const API_KEY = process.env.OPENWEATHER_API_KEY;

    let url = "";

    try {
        if (!API_KEY) {
            return res.status(500).json({ error: "Missing OPENWEATHER_API_KEY" });
        }

        // Current weather by city
        if (type === "city") {
            if (!city) return res.status(400).json({ error: "Missing city" });
            url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
        }

        // Current weather by coordinates
        else if (type === "coords") {
            if (!lat || !lon) return res.status(400).json({ error: "Missing coordinates" });
            url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        }

        // Air Quality
        else if (type === "air") {
            if (!lat || !lon) return res.status(400).json({ error: "Missing coordinates" });
            url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
        } else {
            return res.status(400).json({ error: "Invalid type" });
        }

        const response = await fetch(url);
        const data = await response.json();

        res.status(response.status).json(data);

    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
}
