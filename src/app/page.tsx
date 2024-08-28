'use client'

import { useState } from "react";
import axios from 'axios';

const cities: string[] = ['rudrapur', 'delhi', 'mumbai', 'pune', 'nainital', 'bengaluru'];

export default function Home() {
  const [place, setPlace] = useState<string>("");
  const [weather, setWeather] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setPlace(searchTerm);
    if (searchTerm.length > 0) {
      const filteredSuggestions = cities.filter((city) =>
        city.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (suggestion: string) => {
    setPlace(suggestion);
    setSuggestions([]);
  };

  const api_key = '445df7bb470e4b4173bb37e322fb3bec';

  const getWeather = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${api_key}`
      );
      setWeather(response.data);
      console.log(response.data);
    } catch (err) {
      setError('City not found. Please try again.');
      setWeather(null);
    }
  };

  return (
    <main className="w-full h-screen flex items-center justify-center">
      <div className="w-[600px] h-[300px] bg-white rounded flex items-center justify-center flex-col">
        <h1 className="font-semibold text-2xl mb-2">Weather App</h1>
        <form className="flex flex-col items-center justify-center" onSubmit={getWeather}>
          <div className="w-[320px] flex items-center justify-center gap-x-1 border border-gray-500 py-2 mb-1 rounded-xl relative">
            <i className="ri-search-line text-lg font-normal text-gray-500"></i>
            <input
              type="text"
              placeholder="Enter Place.."
              value={place}
              onChange={handleInputChange}
              className="w-[270px] outline-none border-none font-normal text-sm focus:border-none text-gray-500"
            />
            {suggestions.length > 0 && (
              <ul className="absolute top-12 left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSelect(suggestion)}
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button type="submit" className="py-1 px-3 outline-none border-none rounded text-white bg-black">
            Submit
          </button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {weather && (
          <div className="mt-4 text-center">
            <h2 className="text-lg font-bold">{weather.name} ({weather.sys.country})</h2>
            <p>🔥{Math.round(weather.main.temp - 273.15)}°C</p>
            <p>💨{weather.wind.speed} m/s</p>
            <p>☁{weather.weather[0].description}</p>
          </div>
        )}
      </div>
    </main>
  );
}
