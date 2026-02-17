/* =========================================================
   CONFIG
========================================================= */

const API_KEY = "3d209e7f431f7f80c9ed98c752708592";   // temporary direct use

const BASE_WEATHER = "https://api.openweathermap.org/data/2.5/weather";
const BASE_AIR = "https://api.openweathermap.org/data/2.5/air_pollution";


/* =========================================================
   FETCH WEATHER BY CITY
========================================================= */

async function fetchWeather(city) {

    try {
        const res = await fetch(
            `${BASE_WEATHER}?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
        );

        if (!res.ok) return { error: true };

        const data = await res.json();

        return formatWeatherData(data);

    } catch {
        return { error: true };
    }
}


/* =========================================================
   FETCH WEATHER BY COORDS
========================================================= */

async function fetchWeatherByCoords(lat, lon) {

    try {
        const res = await fetch(
            `${BASE_WEATHER}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );

        if (!res.ok) return { error: true };

        const data = await res.json();

        return formatWeatherData(data);

    } catch {
        return { error: true };
    }
}


/* =========================================================
   FETCH AQI
========================================================= */

async function fetchAQI(lat, lon) {

    try {
        const res = await fetch(
            `${BASE_AIR}?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        );

        if (!res.ok) return null;

        const data = await res.json();

        const aqiIndex = data.list[0].main.aqi;

        const labels = {
            1: "Good",
            2: "Fair",
            3: "Moderate",
            4: "Poor",
            5: "Very Poor"
        };

        return {
            aqi: aqiIndex,
            aqiLabel: labels[aqiIndex]
        };

    } catch {
        return null;
    }
}


/* =========================================================
   FORMAT DATA (VERY IMPORTANT)
========================================================= */

function formatWeatherData(data) {

    return {
        city: data.name,
        country: data.sys.country,
        description: data.weather[0].description,
        icon: data.weather[0].icon,

        temp: data.main.temp,
        feels: data.main.feels_like,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        wind: data.wind.speed,
        visibility: data.visibility,

        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
        timezone: data.timezone,

        lat: data.coord.lat,
        lon: data.coord.lon
    };
}
