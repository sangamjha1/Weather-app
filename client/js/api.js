/* ================= WEATHER ================= */

async function fetchWeather(city) {

    const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);

    if (!res.ok) return { error: true };

    return await res.json();
}

async function fetchWeatherByCoords(lat, lon) {

    const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);

    if (!res.ok) return { error: true };

    return await res.json();
}


/* ================= AQI ================= */

async function fetchAQI(lat, lon) {

    const res = await fetch(`/api/air?lat=${lat}&lon=${lon}`);

    if (!res.ok) return null;

    return await res.json();
}
