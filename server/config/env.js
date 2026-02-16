const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  PORT: process.env.PORT || 5000,
  WEATHER_API_KEY: process.env.WEATHER_API_KEY,
  BASE_URL: process.env.BASE_URL
};
