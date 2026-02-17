// WEATHER BY CITY
async function fetchWeather(city) {
    try {
        const res = await fetch(`/api/weather?city=${city}`);
        return await res.json();
    } catch {
        return { error: "Network error" };
    }
}

// WEATHER BY GPS
async function fetchWeatherByCoords(lat, lon) {
    try {
        const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
        return await res.json();
    } catch {
        return { error: "Network error" };
    }
}
