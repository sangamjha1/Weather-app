document.addEventListener("DOMContentLoaded", () => {

    const searchBtn = document.getElementById("searchBtn");
    const cityInput = document.getElementById("cityInput");
    const locBtn = document.getElementById("locBtn");
    const themeToggle = document.getElementById("themeToggle");
    const aqiEl = document.getElementById("aqi");
    const loadingState = document.getElementById("loadingState");
    const isIOS =
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.userAgent.includes("Mac") && navigator.maxTouchPoints > 1);
    let locationInProgress = false;
    let hasLocationSuccess = false;
    let shouldRetryAfterCurrent = false;
    let iosRetryHandler = null;
    let loadingJobs = 0;
    const WEATHER_CACHE_KEY = "lastLocationWeather";
    const AQI_CACHE_KEY = "lastLocationAQI";
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
    loadCurrentLocation(false);
    if (isIOS) setupIOSLocationRetry();

    function setupIOSLocationRetry() {
        iosRetryHandler = () => {
            if (!hasLocationSuccess) loadCurrentLocation(false);
        };
        document.addEventListener("touchstart", iosRetryHandler, { passive: true });
        document.addEventListener("click", iosRetryHandler);
    }

    function clearIOSLocationRetry() {
        if (!iosRetryHandler) return;
        document.removeEventListener("touchstart", iosRetryHandler);
        document.removeEventListener("click", iosRetryHandler);
        iosRetryHandler = null;
    }

    function getCachedJson(key) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    }

    function setLoading(isLoading) {
        if (!loadingState) return;

        if (isLoading) {
            loadingJobs += 1;
        } else {
            loadingJobs = Math.max(0, loadingJobs - 1);
        }

        loadingState.classList.toggle("show", loadingJobs > 0);
        loadingState.setAttribute("aria-busy", loadingJobs > 0 ? "true" : "false");
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
        if (weatherCache && weatherCache.data) {
            showWeather(weatherCache.data);
        }

        const aqiCache = getCachedJson(AQI_CACHE_KEY);
        if (aqiCache && aqiCache.data) {
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

    async function loadCurrentLocation(userInitiated = false) {
        if (!navigator.geolocation) return;
        if (locationInProgress) {
            shouldRetryAfterCurrent = true;
            return;
        }
        locationInProgress = true;
        setLoading(true);

        if (aqiEl.innerText === "--") aqiEl.innerText = "...";

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;

                try {
                    const data = await fetchWeatherByCoords(latitude, longitude);
                    if (!data || data.error) {
                        locationInProgress = false;
                        setLoading(false);
                        return;
                    }

                    showWeather(data);
                    setCachedJson(WEATHER_CACHE_KEY, {
                        data,
                        ts: Date.now()
                    });
                    await loadAQIAndCache(latitude, longitude);
                    hasLocationSuccess = true;
                    clearIOSLocationRetry();
                    locationInProgress = false;
                    setLoading(false);
                    if (shouldRetryAfterCurrent) {
                        shouldRetryAfterCurrent = false;
                        loadCurrentLocation(false);
                    }

                } catch {
                    console.warn("Location weather failed");
                    locationInProgress = false;
                    setLoading(false);
                    if (shouldRetryAfterCurrent) {
                        shouldRetryAfterCurrent = false;
                        loadCurrentLocation(false);
                    }
                }
            },
            (err) => {
                if (err && err.code === 1 && userInitiated) {
                    alert("Location permission is blocked. Enable location access in iPhone browser settings for this site.");
                }
                console.warn("Location permission denied");
                locationInProgress = false;
                setLoading(false);
                if (shouldRetryAfterCurrent) {
                    shouldRetryAfterCurrent = false;
                    loadCurrentLocation(false);
                }
            },
            { enableHighAccuracy: false, timeout: 12000, maximumAge: GEO_MAX_AGE_MS }
        );
    }


    /* =========================================================
       SEARCH WEATHER
    ========================================================= */

    async function handleSearch(city) {
        if (!city) return;

        aqiEl.innerText = "...";
        setLoading(true);

        try {
            const data = await fetchWeather(city);

            if (!data || data.error) {
                alert(data?.message || "Unable to fetch weather right now");
                setLoading(false);
                return;
            }

            showWeather(data);
            await loadAQIAndCache(data.lat, data.lon);
            setLoading(false);

        } catch {
            alert("Unable to fetch weather right now");
            setLoading(false);
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

    locBtn.addEventListener("click", () => loadCurrentLocation(true));

});
