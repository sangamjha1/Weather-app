/* =========================================
   OPENWEATHER CONFIG
========================================= */

const API_KEY = "3d209e7f431f7f80c9ed98c752708592";
const BASE = "https://api.openweathermap.org/data/2.5";


/* =========================================
   FORMAT RESPONSE (single clean structure)
========================================= */
function formatWeather(data) {
    return {
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
    };
}


/* =========================================
   CITY SEARCH
========================================= */
async function fetchWeather(city) {
    try {
        const res = await fetch(
            `${BASE}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
        );

        const data = await res.json();

        if (data.cod !== 200) return { error: true };

        return formatWeather(data);

    } catch {
        return { error: true };
    }
}


/* =========================================
   GPS SEARCH
========================================= */
async function fetchWeatherByCoords(lat, lon) {
    try {
        const res = await fetch(
            `${BASE}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );

        const data = await res.json();

        if (data.cod !== 200) return { error: true };

        return formatWeather(data);

    } catch {
        return { error: true };
    }
}


/* =========================================
   AIR QUALITY INDEX
========================================= */
async function fetchAQI(lat, lon) {
    try {
        const res = await fetch(
            `${BASE}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        );

        const data = await res.json();

        if (!data.list) return { aqi: null };

        const aqi = data.list[0].main.aqi;

        return {
            aqi,
            aqiLabel: ["Good", "Fair", "Moderate", "Poor", "Very Poor"][aqi - 1]
        };

    } catch {
        return { aqi: null };
    }
}
