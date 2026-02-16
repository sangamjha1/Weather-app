const BASE_URL = "http://localhost:5000/api/weather";

async function fetchWeather(city) {
    try {
        const res = await fetch(`${BASE_URL}?city=${city}`);
        if (!res.ok) throw new Error();
        return await res.json();
    } catch {
        return { error: true };
    }
}

async function fetchWeatherByCoords(lat, lon) {
    try {
        const res = await fetch(`${BASE_URL}?lat=${lat}&lon=${lon}`);
        if (!res.ok) throw new Error();
        return await res.json();
    } catch {
        return { error: true };
    }
}
