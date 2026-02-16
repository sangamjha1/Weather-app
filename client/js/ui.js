function setBackground(description) {

    if (document.body.classList.contains("light")) return;

    const body = document.body;

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



function showWeather(data) {

    document.getElementById("city").innerText =
        `${data.city}, ${data.country}`;

    document.getElementById("description").innerText =
        data.description;

    document.getElementById("temp").innerText =
        `${Math.round(data.temp)}°C`;

    document.getElementById("feels").innerText =
        Math.round(data.feels);

    document.getElementById("humidity").innerText =
        data.humidity;

    document.getElementById("wind").innerText =
        data.wind;

    document.getElementById("pressure").innerText =
        data.pressure;

    document.getElementById("visibility").innerText =
        data.visibility;

    document.getElementById("sunrise").innerText =
        formatTime(data.sunrise, data.timezone);

    document.getElementById("sunset").innerText =
        formatTime(data.sunset, data.timezone);

    // HIGH RES ICON
    document.getElementById("icon").src =
        `https://openweathermap.org/img/wn/${data.icon}@4x.png`;

    setBackground(data.description.toLowerCase());
}
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

