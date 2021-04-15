import React from "react";

export default function ToggleUnitButton({
  unit,
  setUnit,
  unitButtonText,
  setUnitButtonText,
}) {
  // handle unit toggle
  const handleUnitToggle = (e) => {
    e.preventDefault();
    unit === "default" ? setUnit(1) : setUnit("default");

    unitButtonText === "Change to Fahrenheit"
      ? setUnitButtonText("Change to Celsuis")
      : setUnitButtonText("Change to Fahrenheit");
  };

  return <button onClick={handleUnitToggle}>{unitButtonText}</button>;
}
