/* =========================================================
   DYNAMIC BACKGROUND (DARK MODE ONLY)
========================================================= */
function setBackground(description) {

    if (document.body.classList.contains("light")) return;

    const body = document.body;
    description = description.toLowerCase();

    if (description.includes("rain"))
        body.style.setProperty("--bg2", "#1d3557");

    else if (description.includes("cloud"))
        body.style.setProperty("--bg2", "#374151");

    else if (description.includes("clear"))
        body.style.setProperty("--bg2", "#1e3a8a");

    else if (description.includes("snow"))
        body.style.setProperty("--bg2", "#334155");

    else
        body.style.setProperty("--bg2", "#1e293b");
}


/* =========================================================
   RENDER WEATHER DATA
========================================================= */
function showWeather(data) {

    document.getElementById("city").innerText =
        `${data.name}, ${data.sys.country}`;

    document.getElementById("description").innerText =
        data.weather[0].description;

    document.getElementById("temp").innerText =
        `${Math.round(data.main.temp)}°C`;

    document.getElementById("feels").innerText =
        Math.round(data.main.feels_like);

    document.getElementById("humidity").innerText =
        data.main.humidity;

    document.getElementById("wind").innerText =
        data.wind.speed;

    document.getElementById("pressure").innerText =
        data.main.pressure;

    document.getElementById("visibility").innerText =
        data.visibility ?? "--";

    document.getElementById("sunrise").innerText =
        formatTime(data.sys.sunrise, data.timezone);

    document.getElementById("sunset").innerText =
        formatTime(data.sys.sunset, data.timezone);

    // High resolution weather icon
    document.getElementById("icon").src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

    setBackground(data.weather[0].description);
}


/* =========================================================
   AQI COLOR INDICATOR
========================================================= */
function colorAQI(label) {

    const el = document.getElementById("aqi");

    const colors = {
        "Good": "#22c55e",
        "Fair": "#84cc16",
        "Moderate": "#eab308",
        "Poor": "#f97316",
        "Very Poor": "#ef4444"
    };

    el.style.color = colors[label] || "inherit";
}
