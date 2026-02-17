/* =========================================
   FETCH WEATHER BY CITY
========================================= */
async function fetchWeather(city) {

    try {
        const res = await fetch(`/api/weather?type=city&city=${encodeURIComponent(city)}`);
        const data = await res.json();

        if (data.cod && data.cod !== 200) return { error: true };

        return formatWeather(data);

    } catch {
        return { error: true };
    }
}


/* =========================================
   FETCH WEATHER BY COORDINATES
========================================= */
async function fetchWeatherByCoords(lat, lon) {

    try {
        const res = await fetch(`/api/weather?type=coords&lat=${lat}&lon=${lon}`);
        const data = await res.json();

        if (data.cod && data.cod !== 200) return { error: true };

        return formatWeather(data);

    } catch {
        return { error: true };
    }
}


/* =========================================
   FETCH AIR QUALITY
========================================= */
async function fetchAQI(lat, lon) {

    try {
        const res = await fetch(`/api/weather?type=air&lat=${lat}&lon=${lon}`);
        const data = await res.json();

        const aqi = data.list[0].main.aqi;

        return {
            aqi: aqi,
            aqiLabel: ["Good","Fair","Moderate","Poor","Very Poor"][aqi - 1]
        };

    } catch {
        return { aqi: null, aqiLabel: "--" };
    }
}
