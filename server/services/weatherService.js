const axios = require("axios");
const cache = require("../utils/cache");
const { WEATHER_API_KEY, BASE_URL } = require("../config/env");


// ---------------- FORMAT WEATHER DATA ----------------
function formatWeather(response) {
  return {
    city: response.data.name,
    country: response.data.sys.country,

    temp: response.data.main.temp,
    feels: response.data.main.feels_like,
    humidity: response.data.main.humidity,
    pressure: response.data.main.pressure,
    visibility: response.data.visibility,

    wind: response.data.wind.speed,

    description: response.data.weather[0].description,
    icon: response.data.weather[0].icon,

    sunrise: response.data.sys.sunrise,
    sunset: response.data.sys.sunset,
    timezone: response.data.timezone,

    lat: response.data.coord.lat,
    lon: response.data.coord.lon
  };
}


// ---------------- CITY SEARCH ----------------
async function getWeather(city) {

  const key = `city-${city.toLowerCase()}`;
  const cached = cache.get(key);
  if (cached) return cached;

  try {
    const url = `${BASE_URL}/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`;
    const response = await axios.get(url);

    const data = formatWeather(response);
    cache.set(key, data);
    return data;

  } catch (err) {
    if (err.response && err.response.status === 404)
      return { error: "City not found" };

    return { error: "Weather service unavailable" };
  }
}


// ---------------- GPS SEARCH ----------------
async function getWeatherByCoords(lat, lon) {

  const key = `coord-${lat}-${lon}`;
  const cached = cache.get(key);
  if (cached) return cached;

  try {
    const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;
    const response = await axios.get(url);

    const data = formatWeather(response);
    cache.set(key, data);
    return data;

  } catch {
    return { error: "Location weather failed" };
  }
}


// ---------------- REAL AQI CALCULATION ----------------
function calculateAQI(pm25) {

  // US EPA AQI formula for PM2.5
  if (pm25 <= 12) return (50 / 12) * pm25;
  if (pm25 <= 35.4) return ((100 - 51) / (35.4 - 12)) * (pm25 - 12) + 51;
  if (pm25 <= 55.4) return ((150 - 101) / (55.4 - 35.4)) * (pm25 - 35.4) + 101;
  if (pm25 <= 150.4) return ((200 - 151) / (150.4 - 55.4)) * (pm25 - 55.4) + 151;
  if (pm25 <= 250.4) return ((300 - 201) / (250.4 - 150.4)) * (pm25 - 150.4) + 201;
  return ((500 - 301) / (500.4 - 250.4)) * (pm25 - 250.4) + 301;
}

function getAQILabel(aqi) {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Fair";
  if (aqi <= 150) return "Moderate";
  if (aqi <= 200) return "Poor";
  if (aqi <= 300) return "Very Poor";
  return "Hazardous";
}


// ---------------- AIR QUALITY INDEX ----------------
async function getAirQuality(lat, lon) {

  const key = `aqi-${lat}-${lon}`;
  const cached = cache.get(key);
  if (cached) return cached;

  try {

    const url = `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`;
    const response = await axios.get(url);

    const pm25 = response.data.list[0].components.pm2_5;

    const aqiValue = Math.round(calculateAQI(pm25));
    const label = getAQILabel(aqiValue);

    const result = {
      aqi: aqiValue,
      aqiLabel: label,
      pm25: pm25
    };

    cache.set(key, result);
    return result;

  } catch {
    return { aqi: null, aqiLabel: "--" };
  }
}


module.exports = {
  getWeather,
  getWeatherByCoords,
  getAirQuality
};
