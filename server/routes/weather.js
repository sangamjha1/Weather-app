const express = require("express");
const router = express.Router();
const { getWeather, getWeatherByCoords } = require("../services/weatherService");

router.get("/", async (req, res) => {
  try {

    if (req.query.lat && req.query.lon) {
      const data = await getWeatherByCoords(req.query.lat, req.query.lon);
      return res.json(data);
    }

    const city = req.query.city;
    if (!city) return res.status(400).json({ error: "City required" });

    const data = await getWeather(city);
    res.json(data);

  } catch {
    res.status(500).json({ error: "City not found" });
  }
});

module.exports = router;
const { getAirQuality } = require("../services/weatherService");

router.get("/air", async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const data = await getAirQuality(lat, lon);
    res.json(data);
  } catch {
    res.status(500).json({ error: "AQI error" });
  }
});
