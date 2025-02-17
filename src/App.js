"use client"

import { useState, useEffect } from "react"
import kontinentData from "./data/kontinent.json"
import landData from "./data/land.json"
import "./App.css"

function App() {
  const [continents, setContinents] = useState([])
  const [selectedContinent, setSelectedContinent] = useState(null)
  const [filteredCountries, setFilteredCountries] = useState([])

  useEffect(() => {
    setContinents(kontinentData)
  }, [])

  const handleContinentClick = (continent) => {
    const selected = continents.find((c) => c.code === continent)
    setSelectedContinent(selected)

    if (selected) {
      // Filter countries based on the selected continent code
      const filtered = landData.filter(
        (country) => country.continent === continent
      )
      setFilteredCountries(filtered)
    } else {
      setFilteredCountries([])
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Continents and Countries</h1>
        <div className="buttons">
          {continents.map((continent) => (
            <button
              key={continent.code}
              onClick={() => handleContinentClick(continent.code)}
              className={selectedContinent?.code === continent.code ? "active" : ""}
            >
              {continent.name}
            </button>
          ))}
        </div>
        {selectedContinent && (
          <div className="continent">
            <h2>{selectedContinent.name}</h2>
            <p>Area: {selectedContinent.areaSqKm.toLocaleString()} sq km</p>
            <p>Population: {selectedContinent.population.toLocaleString()}</p>
            <p>Number of Countries: {selectedContinent.countries}</p>
            <p>Major Lines: {selectedContinent.lines.join(", ")}</p>
            <p>Oceans: {selectedContinent.oceans.join(", ")}</p>
            <h3>Countries:</h3>
            <ul>
              {filteredCountries.map((country) => (
                <li key={country.code}>
                  {country.name} ({country.code})
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>
    </div>
  )
}

export default App
