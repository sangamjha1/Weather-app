export default async function handler(req, res) {

  const { city, lat, lon } = req.query;
  const API_KEY = process.env.WEATHER_API_KEY;

  try {

    let url;

    if (city) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    } else if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    } else {
      return res.status(400).json({ error: "Missing parameters" });
    }

    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== 200) {
      return res.status(404).json({ error: "City not found" });
    }

    return res.status(200).json({
      city: data.name,
      country: data.sys.country,

      temp: data.main.temp,
      feels: data.main.feels_like,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      visibility: data.visibility,

      wind: data.wind.speed,

      description: data.weather[0].description,
      icon: data.weather[0].icon,

      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      timezone: data.timezone,

      lat: data.coord.lat,
      lon: data.coord.lon
    });

  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}
