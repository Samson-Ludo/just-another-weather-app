// import Geocode from "react-geocode";

// // set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
// Geocode.setApiKey("AIzaSyBqFYFTfigmAePu0Edl9cTlebfd2p4rxa8");

// // set response language. Defaults to english.
// Geocode.setLanguage("en");

// // set location_type filter . Its optional.
// Geocode.setLocationType("ROOFTOP");

// // Enable or disable logs. Its optional.
// Geocode.enableDebug();

// // change coordinates to location name
// const coordToName = (lat, long) => {
//   // Get address from latitude & longitude.
//   // the below parser will work for most of the countries

//   const address = Geocode.fromLatLng(lat, long).then(
//     (response) => {
//       let city, state, country;
//       // const address = response.results[0].formatted_address;
//       for (let i = 0; i < response.results[0].address_components.length; i++) {
//         for (
//           let j = 0;
//           j < response.results[0].address_components[i].types.length;
//           j++
//         ) {
//           switch (response.results[0].address_components[i].types[j]) {
//             case "locality":
//               city = response.results[0].address_components[i].long_name;
//               break;
//             case "administrative_area_level_1":
//               state = response.results[0].address_components[i].long_name;
//               break;
//             case "country":
//               country = response.results[0].address_components[i].long_name;
//               break;
//             default:
//               state = response.results[0].address_components[i].long_name;
//               country = response.results[0].address_components[i].long_name;
//           }
//         }
//       }
//       console.log(city, state, country);
//       console.log(address);
//       return `${city}, ${state}, ${country}`;
//     },
//     (error) => {
//       console.error(error);
//     }
//   );
// };

// // change location name to coordinates
// const nameToCoord = (name) => {
//   // Get latitude & longitude from address.
//   Geocode.fromAddress(name).then(
//     (response) => {
//       const { lat, lng } = response.results[0].geometry.location;
//       return { lat, lng };
//     },
//     (error) => {
//       console.error(error);
//     }
//   );
// };

// export { coordToName, nameToCoord };
//
