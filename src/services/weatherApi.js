const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const BASE_URL = "https://api.openweathermap.org";

async function request(url) {
  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    throw new Error(
      errorData.message || `Request failed with status ${response.status}`
    );
  }

  return response.json();
}

// Convert city name → coordinates
export async function getCoordinates(city) {
  if (!city.trim()) {
    throw new Error("Please enter a city name");
  }

  const url =
    `${BASE_URL}/geo/1.0/direct` +
    `?q=${encodeURIComponent(city.trim())}` +
    `&limit=1` +
    `&appid=${API_KEY}`;

  const data = await request(url);

  if (!data.length) {
    throw new Error("City not found");
  }

  return {
    latitude: data[0].lat,
    longitude: data[0].lon,
    city: data[0].name,
    country: data[0].country,
    state: data[0].state || "",
  };
}

// Get weather using coordinates
export async function getWeatherByCoordinates(latitude, longitude) {
  const url =
    `${BASE_URL}/data/2.5/weather` +
    `?lat=${latitude}` +
    `&lon=${longitude}` +
    `&appid=${API_KEY}` +
    `&units=metric`;

  return request(url);
}

// Search city → coordinates → weather
export async function getWeather(city) {
  const location = await getCoordinates(city);

  const weather = await getWeatherByCoordinates(
    location.latitude,
    location.longitude
  );

  return {
    ...weather,
    location,
  };
}

// Get weather using browser location
export async function getWeatherByLocation(latitude, longitude) {
  return getWeatherByCoordinates(latitude, longitude);
}