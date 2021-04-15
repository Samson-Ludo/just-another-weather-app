import { useState } from "react";
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
export const GetUserLocation = () => {
  const { latitude, longitude, error } = useGeolocation();
  return !error
    ? { lat: latitude, lon: longitude }
    : "cant't find user location";
};

// hook for getting user location name
export const CoordToAddress = () => {
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
