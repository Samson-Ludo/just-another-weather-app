import React from "react";
import Geocode from "react-geocode";
import "../App.css";

// set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
Geocode.setApiKey(process.env.REACT_APP_GEOCODING_API);
// set response language. Defaults to english.
Geocode.setLanguage("en");
// set location_type filter . Its optional.
Geocode.setLocationType("ROOFTOP");
// Enable or disable logs. Its optional.
Geocode.enableDebug();

export default function InputForm({
  cityName,
  setCityName,
  setCoords,
  setLocationName,
}) {
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

  return (
    <form>
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
    </form>
  );
}
