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
    const WEATHER_CACHE_KEY = "lastLocationWeather";
    const AQI_CACHE_KEY = "lastLocationAQI";
    const CACHE_TTL_MS = 15 * 60 * 1000;
    const GEO_MAX_AGE_MS = 5 * 60 * 1000;


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

    renderCachedLocationWeather();

    // iOS Safari can suppress geolocation prompt on initial page load.
    // Try once on load and retry on first user interaction.
    loadCurrentLocation();
    if (isIOS) setupIOSLocationRetry();

    function setupIOSLocationRetry() {
        const retry = () => loadCurrentLocation();
        document.addEventListener("touchend", retry, { once: true });
        document.addEventListener("click", retry, { once: true });
    }

    function getCachedJson(key) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    }

    function isFresh(timestamp) {
        return Number.isFinite(timestamp) && Date.now() - timestamp < CACHE_TTL_MS;
    }

    function setCachedJson(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch {
            // Ignore storage errors on constrained devices.
        }
    }

    function renderCachedLocationWeather() {
        const weatherCache = getCachedJson(WEATHER_CACHE_KEY);
        if (weatherCache && weatherCache.data && isFresh(weatherCache.ts)) {
            showWeather(weatherCache.data);
        }

        const aqiCache = getCachedJson(AQI_CACHE_KEY);
        if (aqiCache && isFresh(aqiCache.ts)) {
            renderAQI(aqiCache.data);
        }
    }

    function renderAQI(data) {
        if (data && data.aqi !== null) {
            aqiEl.innerText = `${data.aqi} (${data.aqiLabel})`;
            colorAQI(data.aqiLabel);
        } else {
            aqiEl.innerText = "--";
        }
    }

    async function loadAQIAndCache(lat, lon) {
        try {
            const data = await fetchAQI(lat, lon);

            if (data && !data.error && data.aqi !== null) {
                renderAQI(data);
                setCachedJson(AQI_CACHE_KEY, {
                    data,
                    ts: Date.now()
                });
            } else {
                aqiEl.innerText = "--";
            }
        } catch {
            aqiEl.innerText = "--";
        }
    }

    async function loadCurrentLocation() {
        if (!navigator.geolocation || locationInProgress) return;
        locationInProgress = true;

        if (aqiEl.innerText === "--") aqiEl.innerText = "...";

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
                    setCachedJson(WEATHER_CACHE_KEY, {
                        data,
                        ts: Date.now()
                    });
                    loadAQIAndCache(latitude, longitude);
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
            { enableHighAccuracy: false, timeout: 7000, maximumAge: GEO_MAX_AGE_MS }
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
            loadAQIAndCache(data.lat, data.lon);

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
