# 🌦 Weather Insight App

A full-stack weather application built using **HTML, CSS, JavaScript and Node.js**.
The app provides real-time weather data using a secure backend proxy and OpenWeather API.

---

## 🚀 Features

- City based weather search
- Current location weather (GPS)
- Temperature, humidity, wind, sunrise & sunset
- Dynamic background based on weather
- Dark / Light mode toggle
- API caching (reduces API calls)
- Secure API key handling via backend

---

## 🏗 Tech Stack

Frontend:
- HTML
- CSS
- Vanilla JavaScript

Backend:
- Node.js
- Express.js
- Axios
- Node Cache

API:
- OpenWeatherMap API

---

## 🔐 Why Backend is Used?

Instead of calling the weather API directly from frontend,
a backend proxy is used to:

- Protect API key
- Filter response data
- Implement caching
- Prevent API abuse

---

## 📂 Project Structure
client → frontend UI
server → backend API proxy


---

## ⚙️ Run Locally

### 1. Install dependencies
cd server
npm install

### 2. Add API Key
Create `.env`
PORT=5000
WEATHER_API_KEY=YOUR_KEY
BASE_URL=https://api.openweathermap.org/data/2.5


### 3. Start server
node server.js

Open `client/index.html`

---

## 🧠 Learning Outcomes

- REST API integration
- Backend proxy architecture
- Environment variable security
- Asynchronous JavaScript
- Browser geolocation API
- UI state management

---

## 📌 Future Improvements

- 7 day forecast
- Charts
- Deploy online
- PWA support
