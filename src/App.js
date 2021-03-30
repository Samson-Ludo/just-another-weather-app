import React, { useState, useEffect } from "react";
import "./App.css";

// google map api key = AIzaSyB8WdX8VJtKQAiAvFlWdYTbIphsArb_3VI
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

// get geolocation
let geolocation;

// define lat and lon in local storage
let localStoreLat = localStorage.getItem("lat");
let localStoreLon = localStorage.getItem("lon");

const rememberLastLocation = () => {
  if (localStoreLat && localStoreLon)
    return { lat: localStoreLat, lon: localStoreLon };
  else {
    // else get current location, save and retrieve to and from localStorage
    localStorage.setItem("lat", geolocation.latitude);
    localStorage.setItem("lon", geolocation.longitude);
    return {
      lat: localStorage.getItem("lat"),
      lon: localStorage.getItem("lon"),
    };
  }
};

const App = () => {
  geolocation = useGeolocation();

  const [cityName, setCityName] = useState("");
  const [unit, setUnit] = useState("default");
  const [unitButtonText, setUnitButtonText] = useState("Change to Fahrenheit");
  const [locationName, setLocationName] = useState("");
  const [coords, setCoords] = useState({
    lat: geolocation.latitude,
    lon: geolocation.longitude,
  });

  // on page load
  useEffect(() => {
    setCoords(rememberLastLocation());
  }, []);
  // get location name
  Geocode.fromLatLng(coords.lat, coords.lon).then(
    (response) => {
      let city, state, country;
      // const address = response.results[0].formatted_address;
      for (let i = 0; i < response.results[0].address_components.length; i++) {
        for (
          let j = 0;
          j < response.results[0].address_components[i].types.length;
          j++
        ) {
          switch (response.results[0].address_components[i].types[j]) {
            case "locality":
              city = response.results[0].address_components[i].long_name;
              break;
            case "administrative_area_level_1":
              state = response.results[0].address_components[i].long_name;
              break;
            case "country":
              country = response.results[0].address_components[i].long_name;
              break;
            default:
              state = response.results[0].address_components[i].long_name;
              country = response.results[0].address_components[i].long_name;
          }
        }
      }
      // console.log(city, state, country);
      // console.log(address);
      setLocationName(`${city}, ${state}, ${country}`);
    },
    (error) => {
      console.error(error);
    }
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
        setCoords({
          lat: localStorage.getItem("lat"),
          lon: localStorage.getItem("lon"),
        });
        setLocationName(cityName);

        console.log({ locationName, coords });
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

  // get weather data for celsius
  let celsius = useOpenWeather({
    key: "741aa3002231e12860b14385a16f2fd1",
    lat: coords.lat,
    lon: coords.lon,
    lang: "en",
    unit: "metric", // values are (metric, standard, imperial)
  });

  // get weather data for fahrenheit
  let fahrenheit = useOpenWeather({
    key: "741aa3002231e12860b14385a16f2fd1",
    lat: coords.lat,
    lon: coords.lon,
    lang: "en",
    unit: "imperial", // values are (metric, standard, imperial)
  });
  console.log({ locationName, coords });

  const renderSwitch = (param) => {
    switch (param) {
      case 1:
        return (
          <ReactWeather
            isLoading={fahrenheit.isloading}
            errorMessage={fahrenheit.errorMessage}
            data={fahrenheit.data}
            lang="en"
            locationLabel={locationName}
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
            locationLabel={locationName}
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
