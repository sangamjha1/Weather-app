export default async function handler(req, res) {

    const { city, lat, lon, type } = req.query;
    const API_KEY = "3d209e7f431f80c9ed98c752708592";

    let url = "";

    try {

        // Current weather by city
        if (type === "city") {
            url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
        }

        // Current weather by coordinates
        else if (type === "coords") {
            url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        }

        // Air Quality
        else if (type === "air") {
            url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        res.status(200).json(data);

    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
}
