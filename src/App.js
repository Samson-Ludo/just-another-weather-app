import React, { useState } from "react";
import "./App.css";
import InputForm from "./components/InputForm";
import ToggleUnitButton from "./components/ToggleUnitButton";
import WeatherReport from "./components/WeatherReport";

const App = () => {
  const [cityName, setCityName] = useState("");
  const [unit, setUnit] = useState("default");
  const [unitButtonText, setUnitButtonText] = useState("Change to Fahrenheit");
  const [coords, setCoords] = useState({});
  const [locationName, setLocationName] = useState("");

  return (
    <div className="App">
      <div className="App-header">
        {/* serach for cities  */}
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

      {/* toggle weather units  */}
      <WeatherReport unit={unit} coords={coords} locationName={locationName} />
    </div>
  );
};

export default App;
