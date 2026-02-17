document.addEventListener("DOMContentLoaded", () => {

    const searchBtn = document.getElementById("searchBtn");
    const cityInput = document.getElementById("cityInput");
    const locBtn = document.getElementById("locBtn");
    const themeToggle = document.getElementById("themeToggle");
    const aqiEl = document.getElementById("aqi");


    /* =========================================================
       THEME SYSTEM (PERSISTENT)
    ========================================================= */

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") document.body.classList.add("light");

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("light");
        const mode = document.body.classList.contains("light") ? "light" : "dark";
        localStorage.setItem("theme", mode);
    });


    /* =========================================================
       LOAD CURRENT LOCATION ON PAGE OPEN
    ========================================================= */

    loadCurrentLocation();

    async function loadCurrentLocation() {
        if (!navigator.geolocation) return;

        aqiEl.innerText = "...";

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;

                try {
                    const data = await fetchWeatherByCoords(latitude, longitude);
                    if (!data || data.error) return;

                    showWeather(data);
                    loadAQI(latitude, longitude);

                } catch {
                    console.warn("Location weather failed");
                }
            },
            () => console.warn("Location permission denied"),
            { enableHighAccuracy: false, timeout: 8000 }
        );
    }


    /* =========================================================
       SEARCH WEATHER
    ========================================================= */

    async function handleSearch(city) {
        if (!city) return;

        aqiEl.innerText = "...";

        try {
            const data = await fetchWeather(city);

            if (!data || data.error) {
                alert("City not found");
                return;
            }

            showWeather(data);
            loadAQI(data.coord.lat, data.coord.lon);

        } catch {
            alert("Unable to fetch weather right now");
        }
    }

    searchBtn.addEventListener("click", () => {
        handleSearch(cityInput.value.trim());
    });

    cityInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") handleSearch(cityInput.value.trim());
    });


    /* =========================================================
       GPS BUTTON
    ========================================================= */

    locBtn.addEventListener("click", loadCurrentLocation);

});


/* =========================================================
   AQI FETCHER (DIRECT OPENWEATHER)
========================================================= */

async function loadAQI(lat, lon) {

    const aqiEl = document.getElementById("aqi");

    try {
        const data = await fetchAQI(lat, lon);

        if (data && data.aqi !== null) {
            aqiEl.innerText = `${data.aqi} (${data.aqiLabel})`;
            colorAQI(data.aqiLabel);
        } else {
            aqiEl.innerText = "--";
        }

    } catch {
        aqiEl.innerText = "--";
    }
}
