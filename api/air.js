export default async function handler(req, res) {

  const { lat, lon } = req.query;
  const API_KEY = "b7d147fb956da7f87dafebd8e6028f89";

  if (!lat || !lon)
    return res.status(400).json({ error: "Missing coordinates" });

  try {

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
