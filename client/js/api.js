/* =========================================================
   BACKEND API CONFIG (VERCEL SERVERLESS FUNCTION)
========================================================= */

const BASE_URL = "/api/weather";


/* =========================================================
   FETCH WEATHER BY CITY
========================================================= */

async function fetchWeather(city) {

    try {
        const res = await fetch(`${BASE_URL}?type=city&city=${encodeURIComponent(city)}`);

        const data = await res.json();

        // API returns cod: "404" when city not found
        if (data.cod != 200) {
            return { error: true, message: data.message };
        }

        return formatWeather(data);

    } catch (err) {
        console.error("Weather fetch failed:", err);
        return { error: true };
    }
}


/* =========================================================
   FETCH WEATHER BY COORDINATES (GPS)
========================================================= */

async function fetchWeatherByCoords(lat, lon) {

    try {
        const res = await fetch(`${BASE_URL}?type=coords&lat=${lat}&lon=${lon}`);

        const data = await res.json();

        if (data.cod != 200) return { error: true };

        return formatWeather(data);

    } catch (err) {
        console.error("Geo weather failed:", err);
        return { error: true };
    }
}


/* =========================================================
   FETCH AIR QUALITY
========================================================= */

async function fetchAQI(lat, lon) {

    try {
        const res = await fetch(`${BASE_URL}?type=air&lat=${lat}&lon=${lon}`);

        const data = await res.json();

        if (!data || !data.list || !data.list.length)
            return { error: true };

        const aqiValue = data.list[0].main.aqi;
        const aqiLabel = aqiToText(aqiValue);

        return {
            aqi: convertAQI(aqiValue),
            aqiLabel
        };

    } catch (err) {
        console.error("AQI failed:", err);
        return { error: true };
    }
}


/* =========================================================
   HELPERS
========================================================= */

function formatWeather(data) {
    return {
        city: data.name,
        country: data.sys.country,
        description: data.weather[0].description,
        icon: data.weather[0].icon,

        temp: data.main.temp,
        feels: data.main.feels_like,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        visibility: data.visibility,
        wind: data.wind.speed,

        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
        timezone: data.timezone,

        lat: data.coord.lat,
        lon: data.coord.lon
    };
}


/* Convert OWM AQI (1-5) → Approx real AQI scale */
function convertAQI(level) {
    const map = {
        1: 40,
        2: 80,
        3: 130,
        4: 200,
        5: 300
    };
    return map[level] || level;
}

function aqiToText(level) {
    const labels = {
        1: "Good",
        2: "Fair",
        3: "Moderate",
        4: "Poor",
        5: "Very Poor"
    };
    return labels[level] || "Unknown";
}
