import React, { useState } from "react";
import "./App.css";

import ReactWeather, { useOpenWeather } from "react-open-weather";
import useGeolocation from "react-hook-geolocation";
import Geocode from "react-geocode";

// set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
Geocode.setApiKey(process.env.REACT_APP_GEOCODING_API);
// set response language. Defaults to english.
Geocode.setLanguage("en");
// set location_type filter . Its optional.
Geocode.setLocationType("ROOFTOP");
// Enable or disable logs. Its optional.
Geocode.enableDebug();

// hook for getting user location coord
const GetUserLocation = () => {
  const { latitude, longitude, error } = useGeolocation();
  return !error
    ? { lat: latitude, lon: longitude }
    : "cant't find user location";
};

// hook for getting user location name
const CoordToAddress = () => {
  const [address, setAddress] = useState("");

  const userLocation = GetUserLocation();

  userLocation.lat
    ? Geocode.fromLatLng(userLocation.lat, userLocation.lon).then(
        (response) => {
          const formattedAddress = response.results[0].formatted_address;
          setAddress(formattedAddress);
        },
        (error) => {
          console.error(error);
        }
      )
    : console.log("loading...");

  return address;
};

const App = () => {
  const [cityName, setCityName] = useState("");
  const [unit, setUnit] = useState("default");
  const [unitButtonText, setUnitButtonText] = useState("Change to Fahrenheit");
  const [coords, setCoords] = useState({});
  const [locationName, setLocationName] = useState("");

  // get user location coords
  const userLocation = GetUserLocation();

  // get user location name
  const userAddress = CoordToAddress();

  // handle city search
  const handleCitySearch = (e) => {
    e.preventDefault();

    // Get latitude & longitude from address.
    Geocode.fromAddress(cityName).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;

        // save last location details in local storage
        localStorage.setItem("lat", lat);
        localStorage.setItem("lon", lng);
        localStorage.setItem("locationName", cityName);

        // update location coords
        setCoords({
          lat: localStorage.getItem("lat"),
          lon: localStorage.getItem("lon"),
        });

        // update location name
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
        {/* input city name  */}
        <input
          type="text"
          value={cityName}
          placeholder={"City, Country"}
          onChange={(e) => setCityName(e.target.value)}
        />
        {/* search city  */}
        <button type="submit" onClick={handleCitySearch}>
          Search City
        </button>
        <hr />

        {/* toggle units  */}
        <button onClick={handleUnitToggle}>{unitButtonText}</button>
      </form>
      {/* render switched weather units  */}
      {renderSwitch(unit)}
    </div>
  );
};

export default App;
