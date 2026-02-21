export default async function handler(req, res) {

  const { lat, lon } = req.query;
  const API_KEY = process.env.OPENWEATHER_API_KEY;

  if (!lat || !lon)
    return res.status(400).json({ error: "Missing coordinates" });

  try {
    if (!API_KEY)
      return res.status(500).json({ error: "Missing OPENWEATHER_API_KEY" });

    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    const aqi = data.list[0].main.aqi;

    const labels = ["Good","Fair","Moderate","Poor","Very Poor"];

    return res.status(200).json({
      aqi: aqi,
      aqiLabel: labels[aqi - 1]
    });

  } catch {
    return res.status(500).json({ error: "AQI fetch failed" });
  }
}
