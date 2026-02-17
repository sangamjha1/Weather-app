const API_KEY = "YOUR_VERCEL_ENV_KEY"; // keep same name you added in Vercel


/* =========================================================
   CITY WEATHER
========================================================= */
async function fetchWeather(city) {
    try {

        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
        );

        if (!res.ok) return { error: true };

        return await res.json();

    } catch {
        return { error: true };
    }
}


/* =========================================================
   GPS WEATHER
========================================================= */
async function fetchWeatherByCoords(lat, lon) {
    try {

        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );

        if (!res.ok) return { error: true };

        return await res.json();

    } catch {
        return { error: true };
    }
}


/* =========================================================
   AQI (SERVERLESS FUNCTION)
========================================================= */
async function fetchAQI(lat, lon) {
    try {

        const res = await fetch(`/api/air?lat=${lat}&lon=${lon}`);

        if (!res.ok) return null;

        return await res.json();

    } catch {
        return null;
    }
}
