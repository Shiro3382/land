"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import kontinentData from "./data/kontinent.json"
import landData from "./data/land.json"
import "./App.css"

function App() {
  const [continents, setContinents] = useState([])
  const [selectedContinent, setSelectedContinent] = useState(null)
  const [filteredCountries, setFilteredCountries] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setContinents(kontinentData)
  }, [])

  const handleContinentClick = async (continent) => {
    setLoading(true)
    setError(null)

    try {
      const selected = continents.find((c) => c.code === continent)
      setSelectedContinent(selected)

      if (selected) {
        const filtered = landData.filter((country) => country.continent === continent)

        const countriesWithInfo = await Promise.all(
          filtered.map(async (country) => {
            const response = await fetch(`https://restcountries.com/v3.1/alpha/${country.code}`)
            if (!response.ok) {
              throw new Error(`Failed to fetch data for country code: ${country.code}`)
            }
            const data = await response.json()
            console.log(`Country code: ${country.code}`, data)

            if (data && data[0] && data[0].flags && data[0].flags.svg) {
              return {
                ...country,
                flag: data[0].flags.svg,
                capital: data[0].capital ? data[0].capital[0] : "N/A",
              }
            } else {
              console.error(`Flag not found for country code: ${country.code}`)
              return {
                ...country,
                flag: "/placeholder.svg",
                capital: data[0].capital ? data[0].capital[0] : "N/A",
              }
            }
          }),
        )

        setFilteredCountries(countriesWithInfo)
      } else {
        setFilteredCountries([])
        setError("No data available for this continent.")
      }
    } catch (err) {
      console.error("Error fetching country information:", err)
      setError("Failed to fetch country information. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const filteredContinents = continents.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="App bg-gray-100 min-h-screen p-5">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-6">Continents and Countries</h1>
        <input
          type="text"
          placeholder="Search for a continent..."
          className="mt-4 p-2 border rounded w-full md:w-1/2 text-lg"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex justify-center gap-2 mt-6 flex-wrap">
          {filteredContinents.map((continent) => (
            <motion.button
              key={continent.code}
              onClick={() => handleContinentClick(continent.code)}
              className={`p-3 rounded-lg border text-lg ${
                selectedContinent?.code === continent.code ? "bg-blue-500 text-white" : "bg-white hover:bg-blue-100"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {continent.name}
            </motion.button>
          ))}
        </div>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-8">
            <div className="loader"></div>
            <p className="text-gray-600 mt-2">Loading continent information...</p>
          </motion.div>
        )}
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {selectedContinent && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 p-6 bg-white shadow-lg rounded-lg"
          >
            <h2 className="text-3xl font-semibold text-blue-700 mb-4">{selectedContinent.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <p>
                <span className="font-semibold">Area:</span> {selectedContinent.areaSqKm.toLocaleString()} sq km
              </p>
              <p>
                <span className="font-semibold">Population:</span> {selectedContinent.population.toLocaleString()}
              </p>
              <p>
                <span className="font-semibold">Number of Countries:</span> {selectedContinent.countries}
              </p>
              <p>
                <span className="font-semibold">Major Lines:</span> {selectedContinent.lines.join(", ")}
              </p>
              <p>
                <span className="font-semibold">Oceans:</span> {selectedContinent.oceans.join(", ")}
              </p>
            </div>
            <h3 className="text-2xl font-semibold mt-6 mb-4 text-blue-600">Countries:</h3>
            <div className="countries-grid">
              {filteredCountries.map((country) => (
                <motion.div
                  key={country.code}
                  className="bg-gray-50 p-4 rounded-lg shadow country-card"
                  whileHover={{ scale: 1.03 }}
                >
                  <img
                    src={country.flag || "/placeholder.svg"}
                    alt={`${country.name} flag`}
                    className="flag-image"
                  />
                  <h4 className="font-semibold">{country.name}</h4>
                  <p className="text-sm text-gray-600">Capital: {country.capital}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </header>
    </div>
  )
}

export default App

