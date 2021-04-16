import React from "react";
import ReactWeather, { useOpenWeather } from "react-open-weather";
import {
  GetUserLocation,
  CoordToAddress,
} from "../GeoLocationHooks/geolocation";

export default function WeatherReport({ unit, coords, locationName }) {
  // get user location coords
  const userLocation = GetUserLocation();

  // get user location name
  const userAddress = CoordToAddress();

  // retrieve last location details in local storage
  let lat = localStorage.getItem("lat");
  let lon = localStorage.getItem("lon");
  let location = localStorage.getItem("locationName");

  let latitude = coords.lat ? coords.lat : lat ? lat : userLocation.lat;
  let longitude = coords.lon ? coords.lon : lon ? lon : userLocation.lon;

  // get weather data for celsius
  let celsius = useOpenWeather({
    key: process.env.REACT_APP_OPEN_WEATHER_API,
    lat: latitude,
    lon: longitude,
    lang: "en",
    unit: "metric", // values are (metric, standard, imperial)
  });

  // get weather data for fahrenheit
  let fahrenheit = useOpenWeather({
    key: process.env.REACT_APP_OPEN_WEATHER_API,
    lat: latitude,
    lon: longitude,
    lang: "en",
    unit: "imperial", // values are (metric, standard, imperial)
  });

  // conditional rendering of weather report based on desried unit
  switch (unit) {
    case 1:
      return (
        <ReactWeather
          isLoading={fahrenheit.isloading}
          errorMessage={fahrenheit.errorMessage}
          data={fahrenheit.data}
          lang="en"
          locationLabel={locationName || location || userAddress}
          unitsLabels={{ temperature: "F", windSpeed: "Km/h" }}
          showForecast
        />
      );
    default:
      return (
        <ReactWeather
          isLoading={celsius.isLoading}
          errorMessage={celsius.errorMessage}
          data={celsius.data}
          lang="en"
          locationLabel={locationName || location || userAddress}
          unitsLabels={{ temperature: "C", windSpeed: "Km/h" }}
          showForecast
        />
      );
  }
}
