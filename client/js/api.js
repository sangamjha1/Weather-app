const API_KEY = "3d209e7f431f7f80c9ed98c752708592";

/* ================= WEATHER BY CITY ================= */

async function fetchWeather(city) {
    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
        );

        if (!res.ok) return { error: true };

        const data = await res.json();

        return formatWeatherData(data);

    } catch {
        return { error: true };
    }
}

/* ================= WEATHER BY COORDS ================= */

async function fetchWeatherByCoords(lat, lon) {
    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );

        if (!res.ok) return { error: true };

        const data = await res.json();

        return formatWeatherData(data);

    } catch {
        return { error: true };
    }
}

/* ================= AQI ================= */

async function fetchAQI(lat, lon) {
    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        );

        if (!res.ok) return null;

        const data = await res.json();

        const aqi = data.list[0].main.aqi;

        return {
            aqi,
            aqiLabel: ["Good","Fair","Moderate","Poor","Very Poor"][aqi - 1]
        };

    } catch {
        return null;
    }
}

/* ================= FORMAT ================= */

function formatWeatherData(d) {
    return {
        city: d.name,
        country: d.sys.country,
        temp: d.main.temp,
        feels: d.main.feels_like,
        humidity: d.main.humidity,
        pressure: d.main.pressure,
        visibility: d.visibility,
        wind: d.wind.speed,
        description: d.weather[0].description,
        icon: d.weather[0].icon,
        sunrise: d.sys.sunrise,
        sunset: d.sys.sunset,
        timezone: d.timezone,
        lat: d.coord.lat,
        lon: d.coord.lon
    };
}
