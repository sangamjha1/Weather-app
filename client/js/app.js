document.addEventListener("DOMContentLoaded", () => {

    const searchBtn = document.getElementById("searchBtn");
    const cityInput = document.getElementById("cityInput");
    const locBtn = document.getElementById("locBtn");
    const themeToggle = document.getElementById("themeToggle");
    const aqiEl = document.getElementById("aqi");
    const isIOS =
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.userAgent.includes("Mac") && navigator.maxTouchPoints > 1);
    let locationInProgress = false;


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

    // iOS Safari can suppress geolocation prompt on initial page load.
    // Try once on load and retry on first user interaction.
    loadCurrentLocation();
    if (isIOS) setupIOSLocationRetry();

    function setupIOSLocationRetry() {
        const retry = () => loadCurrentLocation();
        document.addEventListener("touchend", retry, { once: true });
        document.addEventListener("click", retry, { once: true });
    }

    async function loadCurrentLocation() {
        if (!navigator.geolocation || locationInProgress) return;
        locationInProgress = true;

        aqiEl.innerText = "...";

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;

                try {
                    const data = await fetchWeatherByCoords(latitude, longitude);
                    if (!data || data.error) {
                        locationInProgress = false;
                        return;
                    }

                    showWeather(data);
                    loadAQI(latitude, longitude);
                    locationInProgress = false;

                } catch {
                    console.warn("Location weather failed");
                    locationInProgress = false;
                }
            },
            () => {
                console.warn("Location permission denied");
                locationInProgress = false;
            },
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
                alert(data?.message || "Unable to fetch weather right now");
                return;
            }

            showWeather(data);
            loadAQI(data.lat, data.lon);

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
   AQI FETCHER (VIA BACKEND API)
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
