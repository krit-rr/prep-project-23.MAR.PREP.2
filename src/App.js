import React, { useEffect, useState } from "react";
import "./App.css";
import logo from "./mlh-prep.png";
import AirPollution from "./AirPollution";
import Sun from "./Sun";
import MapComponent from "./map";
import ThemedBackground from "./components/theme/ThemedBackground";

function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [city, setCity] = useState("New York City");
  const [results, setResults] = useState(null);
  const [searchedLocation, setSearchedLocation] = useState(null);

  // This function is called when the user submits the form
  const handleCitySubmit = (event) => {
    event.preventDefault();
    setIsLoaded(false);
    setResults(null);
    // Fetch weather data from OpenWeatherMap API
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.REACT_APP_APIKEY}`
    )
      .then((res) => res.json())
      .then(
        (result) => {
          if (result["cod"] !== 200) {
            setIsLoaded(false);
          } else {
            setIsLoaded(true);
            setResults(result);
            setSearchedLocation([result.coord.lat, result.coord.lon]); // Set the coordinates of the searched location
          }
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  };
  // If there's an error, log it to the console
  if (error) {
    console.error(error);
  } else {
    return (
      <>
        <div className="fill-height">
          <img className="logo" src={logo} alt="MLH Prep Logo"></img>
          <div className="Page">
            <h2>Enter a city below 👇</h2>
            <form onSubmit={handleCitySubmit}>
              <input
                type="text"
                value={city}
                onChange={(event) => setCity(event.target.value)}
              />
            </form>
            <div className="Results">
              {!isLoaded && <h2>Loading...</h2>}
              {isLoaded && results && (
                <>
                  <h3>{results.weather[0].main}</h3>
                  <p>Feels like {results.main.feels_like}°C</p>
                  <Sun
                    latitude={results.coord.lat}
                    longitude={results.coord.lon}
                    timezone={results.timezone}
                  />
                  <i>
                    <p>
                      {results.name}, {results.sys.country}
                    </p>
                  </i>
                </>
              )}
            </div>
          </div>
          <div className="center">
            {!isLoaded && <h2>Loading...</h2>}
            {isLoaded && results && (
              <AirPollution lat={results.coord.lat} lon={results.coord.lon} />
            )}
          </div>
          <MapComponent
            searchedLocation={searchedLocation}
            searchedLocationName={city}
          />

          {results && (
            <ThemedBackground weatherCondition={results?.weather[0].main} />
          )}
        </div>
      </>
    );
  }
}

export default App;
