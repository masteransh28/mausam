import { useState } from "react";
import {
  getWeather,
  getWeatherByLocation,
} from "./services/weatherApi";
import "./App.css";

// Temporary fallback data
const mockWeather = {
  city: "Kanpur",
  country: "India",
  temperature: 28,
  feelsLike: 30,
  condition: "Partly Cloudy",
  humidity: 68,
  wind: 4.2,
  pressure: 1012,
  visibility: 8.5,
  clouds: 42,
};

// Temporary forecast data
const forecastData = [
  {
    day: "Today",
    icon: "🌤️",
    condition: "Partly Cloudy",
    high: 31,
    low: 24,
  },
  {
    day: "Tue",
    icon: "🌧️",
    condition: "Light Rain",
    high: 29,
    low: 23,
  },
  {
    day: "Wed",
    icon: "⛈️",
    condition: "Thunderstorm",
    high: 27,
    low: 22,
  },
  {
    day: "Thu",
    icon: "☁️",
    condition: "Cloudy",
    high: 30,
    low: 23,
  },
  {
    day: "Fri",
    icon: "☀️",
    condition: "Sunny",
    high: 33,
    low: 24,
  },
];

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(mockWeather);

  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Convert API response into the format our UI needs
  const formatWeatherData = (data) => {
    return {
      city: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      condition: data.weather[0].description,
      humidity: data.main.humidity,
      wind: data.wind.speed,
      pressure: data.main.pressure,
      visibility: data.visibility
        ? (data.visibility / 1000).toFixed(1)
        : "N/A",
      clouds: data.clouds.all,
    };
  };

  // Search weather by city
  const handleSearch = async (e) => {
    e.preventDefault();

    const searchCity = city.trim();

    if (!searchCity) {
      setError("Please enter a city name.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const data = await getWeather(searchCity);

      console.log("Weather data:", data);

      const formattedWeather = formatWeatherData(data);

      setWeather(formattedWeather);
      setCity("");

      setMessage(`Weather updated for ${formattedWeather.city}.`);
    } catch (err) {
      console.error("Search error:", err);

      setError(
        err.message || "Unable to get weather information."
      );
    } finally {
      setLoading(false);
    }
  };

  // Get weather using browser location
  const handleLocation = () => {
    if (!navigator.geolocation) {
      setError(
        "Geolocation is not supported by your browser."
      );
      return;
    }

    setLocationLoading(true);
    setError("");
    setMessage("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);

        try {
          const data = await getWeatherByLocation(
            latitude,
            longitude
          );

          console.log("Location weather:", data);

          const formattedWeather = formatWeatherData(data);

          setWeather(formattedWeather);

          setMessage(
            `Weather updated for ${formattedWeather.city}.`
          );
        } catch (err) {
          console.error("Location weather error:", err);

          setError(
            err.message ||
              "Unable to get weather for your location."
          );
        } finally {
          setLocationLoading(false);
        }
      },

      (geoError) => {
        console.error("Geolocation error:", geoError);

        setLocationLoading(false);

        switch (geoError.code) {
          case 1:
            setError(
              "Location permission denied. Please allow location access."
            );
            break;

          case 2:
            setError(
              "Unable to determine your location."
            );
            break;

          case 3:
            setError(
              "Location request timed out. Please try again."
            );
            break;

          default:
            setError(
              "Something went wrong while detecting your location."
            );
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  return (
    <div className="app">

      {/* Background */}
      <div className="background-glow glow-one"></div>
      <div className="background-glow glow-two"></div>

      <main className="weather-container">

        {/* ================= NAVBAR ================= */}

        <nav className="navbar">

          <div className="logo">
            <div className="logo-icon">☁</div>
            <span>mausam</span>
          </div>

          <div className="nav-links">
            <button className="nav-active">
              Weather
            </button>

            <button>
              Forecast
            </button>

            <button>
              About
            </button>
          </div>

          <button
            className="nav-location"
            onClick={handleLocation}
            disabled={locationLoading}
          >
            <span>⌖</span>

            {locationLoading
              ? "Locating..."
              : "My Location"}
          </button>

        </nav>

        {/* ================= HERO ================= */}

        <section className="hero">

          <div className="hero-text">

            <p className="eyebrow">
              WEATHER TODAY
            </p>

            <h1>
              Know your
              <br />
              <span>weather.</span>
            </h1>

            <p className="hero-description">
              Simple, beautiful and reliable weather
              information designed for everyday life.
            </p>

          </div>

          <div className="hero-date">

            <p>MONDAY</p>

            <strong>01</strong>

            <span>
              SEPTEMBER 2026
            </span>

          </div>

        </section>

        {/* ================= SEARCH ================= */}

        <form
          className="search-box"
          onSubmit={handleSearch}
        >

          <span className="search-icon">
            ⌕
          </span>

          <input
            type="text"
            placeholder="Search any city..."
            value={city}
            onChange={(e) =>
              setCity(e.target.value)
            }
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>

        </form>

        {/* ================= STATUS ================= */}

        {error && (
          <div className="api-error">
            <span>⚠</span>
            <p>{error}</p>
          </div>
        )}

        {message && !error && (
          <p className="location-message">
            {message}
          </p>
        )}

        {/* ================= CURRENT WEATHER ================= */}

        <section className="current-card">

          <div className="current-top">

            <div className="place">

              <span className="pin">
                ●
              </span>

              <div>
                <h2>
                  {weather.city}
                </h2>

                <p>
                  {weather.country}
                </p>
              </div>

            </div>

            <span className="live-status">
              ● LIVE
            </span>

          </div>

          {/* Main temperature */}

          <div className="current-main">

            <div className="condition-icon">
              🌤️
            </div>

            <div className="temperature">

              <strong>
                {weather.temperature}
              </strong>

              <span>
                °C
              </span>

              <p>
                {weather.condition}
              </p>

            </div>

          </div>

          {/* Weather statistics */}

          <div className="weather-stats">

            <WeatherStat
              icon="🌡️"
              label="Feels Like"
              value={`${weather.feelsLike}°C`}
            />

            <WeatherStat
              icon="💧"
              label="Humidity"
              value={`${weather.humidity}%`}
            />

            <WeatherStat
              icon="💨"
              label="Wind"
              value={`${weather.wind} m/s`}
            />

            <WeatherStat
              icon="◉"
              label="Pressure"
              value={`${weather.pressure} hPa`}
            />

            <WeatherStat
              icon="👁"
              label="Visibility"
              value={`${weather.visibility} km`}
            />

            <WeatherStat
              icon="☁"
              label="Cloud Cover"
              value={`${weather.clouds}%`}
            />

          </div>

        </section>

        {/* ================= FORECAST ================= */}

        <section className="forecast-section">

          <div className="section-header">

            <div>

              <p className="eyebrow">
                COMING DAYS
              </p>

              <h2>
                5-Day Forecast
              </h2>

            </div>

            <span>
              {weather.city}
            </span>

          </div>

          <div className="forecast-grid">

            {forecastData.map(
              (item, index) => (

                <div
                  className={`forecast-card ${
                    index === 0
                      ? "forecast-active"
                      : ""
                  }`}
                  key={item.day}
                >

                  <p className="forecast-day">
                    {item.day}
                  </p>

                  <div className="forecast-icon">
                    {item.icon}
                  </div>

                  <p className="forecast-condition">
                    {item.condition}
                  </p>

                  <div className="forecast-temp">

                    <strong>
                      {item.high}°
                    </strong>

                    <span>
                      {item.low}°
                    </span>

                  </div>

                </div>

              )
            )}

          </div>

        </section>

        {/* ================= FOOTER ================= */}

        <footer>

          <div className="footer-logo">
            ☁ mausam
          </div>

          <p>
            Weather made simple.
          </p>

        </footer>

      </main>

    </div>
  );
}

// Reusable weather statistic component
function WeatherStat({
  icon,
  label,
  value,
}) {
  return (
    <div className="weather-stat">

      <div className="stat-icon">
        {icon}
      </div>

      <div>

        <p>
          {label}
        </p>

        <strong>
          {value}
        </strong>

      </div>

    </div>
  );
}

export default App;