const express = require("express");
const cors = require("cors");

const weatherRoute = require("./routes/weather");
const { getAirQuality } = require("./services/weatherService");

const app = express();

app.use(cors());
app.use(express.json());


// WEATHER ROUTE
app.use("/api/weather", weatherRoute);


// AQI ROUTE
app.get("/api/air", async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon)
      return res.status(400).json({ error: "Coordinates required" });

    const data = await getAirQuality(lat, lon);
    res.json(data);

  } catch (err) {
    console.log("AQI ERROR:", err.message);
    res.status(500).json({ error: "AQI failed" });
  }
});


app.get("/", (req, res) => {
  res.send("Weather Backend Running");
});

module.exports = app;
