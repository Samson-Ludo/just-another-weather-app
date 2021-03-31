import React, { useState } from "react";
import "./App.css";

import ReactWeather, { useOpenWeather } from "react-open-weather";
import useGeolocation from "react-hook-geolocation";
import Geocode from "react-geocode";

// set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
Geocode.setApiKey("AIzaSyBqFYFTfigmAePu0Edl9cTlebfd2p4rxa8");
// set response language. Defaults to english.
Geocode.setLanguage("en");
// set location_type filter . Its optional.
Geocode.setLocationType("ROOFTOP");
// Enable or disable logs. Its optional.
Geocode.enableDebug();

const GetUserLocation = () => {
  const { latitude, longitude, error } = useGeolocation();
  return !error
    ? { lat: latitude, lon: longitude }
    : "cant't find user location";
};

const CoordToAddress = (lat, lon) => {
  const [address, setAddress] = useState("");

  Geocode.fromLatLng(lat, lon).then(
    (response) => {
      const formattedAddress = response.results[0].formatted_address;
      setAddress(formattedAddress);
    },
    (error) => {
      console.error(error);
    }
  );

  return address;
};

const App = () => {
  const [cityName, setCityName] = useState("");
  const [unit, setUnit] = useState("default");
  const [unitButtonText, setUnitButtonText] = useState("Change to Fahrenheit");
  const [coords, setCoords] = useState({});
  const [locationName, setLocationName] = useState("");

  const userLocation = GetUserLocation();
  const userAddress = CoordToAddress(
    GetUserLocation().lat,
    GetUserLocation().lon
  );

  // handle city search
  const handleCitySearch = (e) => {
    e.preventDefault();

    // Get latitude & longitude from address.
    Geocode.fromAddress(cityName).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        localStorage.setItem("lat", lat);
        localStorage.setItem("lon", lng);
        localStorage.setItem("locationName", cityName);
        setCoords({
          lat: localStorage.getItem("lat"),
          lon: localStorage.getItem("lon"),
        });
        setLocationName(localStorage.getItem("locationName"));
      },
      (error) => {
        console.error(error);
      }
    );
  };

  // handle unit toggle
  const handleUnitToggle = (e) => {
    e.preventDefault();
    unit === "default" ? setUnit(1) : setUnit("default");

    unitButtonText === "Change to Fahrenheit"
      ? setUnitButtonText("Change to Celsuis")
      : setUnitButtonText("Change to Fahrenheit");
  };

  let lat = localStorage.getItem("lat");
  let lon = localStorage.getItem("lon");
  let location = localStorage.getItem("locationName");

  let latitude = coords.lat ? coords.lat : lat ? lat : userLocation.lat;
  let longitude = coords.lon ? coords.lon : lon ? lon : userLocation.lon;

  // get weather data for celsius
  let celsius = useOpenWeather({
    key: "741aa3002231e12860b14385a16f2fd1",
    lat: latitude,
    lon: longitude,
    lang: "en",
    unit: "metric", // values are (metric, standard, imperial)
  });

  // get weather data for fahrenheit
  let fahrenheit = useOpenWeather({
    key: "741aa3002231e12860b14385a16f2fd1",
    lat: latitude,
    lon: longitude,
    lang: "en",
    unit: "imperial", // values are (metric, standard, imperial)
  });

  const renderSwitch = (param) => {
    switch (param) {
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
  };

  return (
    <div className="App">
      <form className="App-header">
        <h2>Search for other cities</h2>
        <input
          type="text"
          value={cityName}
          placeholder={"City, Country"}
          onChange={(e) => setCityName(e.target.value)}
        />
        <button type="submit" onClick={handleCitySearch}>
          Search City
        </button>
        <hr />
        <button onClick={handleUnitToggle}>{unitButtonText}</button>
      </form>
      {/* render switch weather units  */}
      {renderSwitch(unit)}
    </div>
  );
};

export default App;
