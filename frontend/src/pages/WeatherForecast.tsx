import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Sun,
  Cloud,
  CloudRain,
  Wind,
} from "lucide-react";
import { AppContext } from "../context/appcontext";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

import type { LucideIcon } from "lucide-react";

interface CurrentWeather {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  windDeg: number;
  visibility: number;
  feelsLike: number;
  sunrise: number;
  sunset: number;
  location: string;
  timezoneOffset: number;
}

interface ForecastDay {
  day: string;
  icon: LucideIcon;
  high: number;
  low: number;
  humidity: number;
  precipitation: number;
}
interface ForecastItem {
  dt: number;
  main: {
    temp_max: number;
    temp_min: number;
    humidity: number;
  };
  weather: {
    main: string;
    description: string;
  }[];
  pop: number;
}

interface ForecastApiResponse {
  list: ForecastItem[];
}

const WeatherForecast: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("AppContext must be used inside AppContextProvider");

  const { state, district } = context;
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [manualDistrict, setManualDistrict] = useState("");
  const [isCelsius, setIsCelsius] = useState(true);

  const userDistrict = manualDistrict || district || "Lucknow";
  const userState = state || "Uttar Pradesh";

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const getWeatherIcon = (condition: string) => {
    if (condition.includes("Rain")) return CloudRain;
    if (condition.includes("Cloud")) return Cloud;
    if (condition.includes("Clear")) return Sun;
    return Sun;
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== "") setManualDistrict(searchQuery.trim());
  };

  const fetchWeather = async () => {
    try {
      setLoading(true);

      // ✅ Current Weather
      const currentResp = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
        params: { q: `${userDistrict},IN`, units: "metric", appid: API_KEY },
      });
      const data = currentResp.data;

      setCurrentWeather({
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6),
        windDeg: data.wind.deg,
        visibility: Math.round((data.visibility || 0) / 1000),
        feelsLike: Math.round(data.main.feels_like),
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
        location: `${userDistrict}, ${userState}, India`,
        timezoneOffset: data.timezone,
      });

      // ✅ Forecast (5-day / 3-hour)
      const forecastResp = await axios.get<ForecastApiResponse>(
  `https://api.openweathermap.org/data/2.5/forecast`,
  {
    params: {
      q: `${userDistrict},IN`,
      units: "metric",
      appid: API_KEY,
    },
  }
);

      const dailyForecast: ForecastDay[] = forecastResp.data.list
  // Pick one forecast per day (every 8 × 3h = 24h)
  .filter((_, idx) => idx % 8 === 0)
  .slice(0, 5)
  .map((item: ForecastItem, idx: number) => ({
    day:
      idx === 0
        ? "Today"
        : new Date(item.dt * 1000).toLocaleDateString("en-US", {
            weekday: "long",
          }),
    icon: getWeatherIcon(item.weather[0].main),
    high: Math.round(item.main.temp_max),
    low: Math.round(item.main.temp_min),
    humidity: item.main.humidity,
    precipitation: Math.round((item.pop || 0) * 100),
  }));

      setForecast(dailyForecast);
    } catch (err) {
      console.error("Weather fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (state && district) fetchWeather();
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [state, district, manualDistrict]);

  const toggleUnit = () => setIsCelsius(!isCelsius);
  const convertTemp = (temp: number) => (isCelsius ? temp : Math.round(temp * 9 / 5 + 32));

  if (loading) return <p>Loading weather data...</p>;
  if (!currentWeather) return <p>No weather data available.</p>;

  const localTime = new Date(Date.now() + currentWeather.timezoneOffset * 1000).toLocaleString();

  return (
    <div className="space-y-6">
{/* Modern Search */}
{/* Modern Responsive Search */}
<div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 w-full max-w-6xl mx-auto px-4 gap-4">

  {/* Heading */}
  <h2 className="text-xl sm:text-6xl font-bold text-gray-800 ">
    <div className="mt-3 lg:mt-0 lg:ml-6 bg-blue-50 border-l-4 border-blue-400 p-3 rounded-md text-blue-700 sm:text-xl shadow-sm w-full lg:w-auto">
    🔹 You can search for any district or location worldwide to get accurate weather updates.
  </div>
  </h2>

  {/* Search input + button */}
  <div className="flex flex-col sm:flex-row w-full lg:w-2/3 gap-3">
    <div className="relative flex-1">
      <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-lg">🔍</span>
      <input
        type="text"
        placeholder="Enter district or location..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
      />
    </div>
    <button
      onClick={handleSearch}
      className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full shadow-md transition"
    >
      Search
    </button>
  </div>
</div>
      {/* Current Weather */}
      <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Sky" className="w-full h-full object-cover" />
        </div>
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Current Weather</h2>
              <p>{currentWeather.location}</p>
              <p className="text-sm">Local Time: {localTime}</p>
            </div>
            <div className="text-center">
              <Sun className="w-20 h-20 text-yellow-300 mb-2" />
              <p>{currentWeather.condition}</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold">{convertTemp(currentWeather.temperature)}°{isCelsius ? "C" : "F"}</div>
              <p>Temperature</p>
            </div>
            <div>
              <div>{currentWeather.humidity}%</div>
              <p>Humidity</p>
            </div>
            <div>
              <div>{currentWeather.windSpeed} km/h</div>
              <p>Wind <Wind className="inline w-4 h-4 ml-1" /></p>
            </div>
            <div>
              <div>{currentWeather.visibility} km</div>
              <p>Visibility</p>
            </div>
            <div>
              <div>{new Date(currentWeather.sunrise * 1000).toLocaleTimeString()}</div>
              <p>Sunrise</p>
            </div>
            <div>
              <div>{new Date(currentWeather.sunset * 1000).toLocaleTimeString()}</div>
              <p>Sunset</p>
            </div>
          </div>
          <button onClick={toggleUnit} className="mt-2 px-4 py-2 bg-white text-blue-600 rounded">Toggle °C/°F</button>
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4">5-Day Forecast</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {forecast.map((day, idx) => (
            <div key={idx} className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold">{day.day}</p>
              <day.icon className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <p>{convertTemp(day.high)}° / {convertTemp(day.low)}°</p>
              <p>Humidity: {day.humidity}%</p>
              <p>Rain: {day.precipitation}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* Temperature Trend */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4">Temperature Trend</h3>
      <ResponsiveContainer width="100%" height={200}>
  <LineChart data={forecast}>
    <XAxis 
      dataKey="day" 
      tickFormatter={(day) => day.slice(0, 3)} 
      angle={0} 
      textAnchor="end" 
      interval={0} 
    />
    <YAxis width={30} dx={-5} />
    <Tooltip
      formatter={(value: string | number | undefined) =>
        value !== undefined ? `${convertTemp(Number(value))}°${isCelsius ? "C" : "F"}` : ""
      }
    />
    <Line type="monotone" dataKey="high" stroke="#f56565" name="High Temp" />
    <Line type="monotone" dataKey="low" stroke="#4299e1" name="Low Temp" />
  </LineChart>
</ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeatherForecast;