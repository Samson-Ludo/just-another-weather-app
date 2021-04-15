import React, { useState } from "react";
import ReactWeather, { useOpenWeather } from "react-open-weather";
import "./App.css";
import {
  GetUserLocation,
  CoordToAddress,
} from "./GeoLocationHooks/geolocation";
import InputForm from "./components/InputForm";
import ToggleUnitButton from "./components/ToggleUnitButton";

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
      <div className="App-header">
        <InputForm
          cityName={cityName}
          setCityName={setCityName}
          setCoords={setCoords}
          setLocationName={setLocationName}
        />

        <hr />

        {/* toggle units  */}
        <ToggleUnitButton
          unit={unit}
          setUnit={setUnit}
          unitButtonText={unitButtonText}
          setUnitButtonText={setUnitButtonText}
        />
      </div>

      {/* render switched weather units  */}
      {renderSwitch(unit)}
    </div>
  );
};

export default App;
