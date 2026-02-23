import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/appcontext";

interface Crop {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  grade: string;
  arrival_date: string;
  min_price: string;
  max_price: string;
  modal_price: string;
}

const MarketPrice: React.FC = () => {
  const context = useContext(AppContext);

  const userDistrict: string | undefined = context?.district;
  const defaultDistrict: string = userDistrict || "Mau";

  // 👇 Input field value
  const [districtInput, setDistrictInput] = useState<string>(defaultDistrict);

  // 👇 Actual district used for API
  const [district, setDistrict] = useState<string>(defaultDistrict);

  const [crops, setCrops] = useState<Crop[]>([]);
  const [search, setSearch] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState<boolean>(false);

  const backendUrl = "http://localhost:4000";

  // 🔥 Fetch only when district changes
  useEffect(() => {
    if (!district.trim()) return;

    const fetchPrices = async () => {
      setLoading(true);
      try {
        const formattedDistrict =
          district.charAt(0).toUpperCase() +
          district.slice(1).toLowerCase();

        const res = await fetch(
          `${backendUrl}/api/marketprices/${formattedDistrict}`
        );

        if (!res.ok) throw new Error("Failed to fetch data");

        const data = await res.json();
        setCrops(data.records || []);
      } catch (err) {
        console.error("Error fetching market prices:", err);
        setCrops([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, [district]);

  // 👇 Button click handler
  const handleDistrictSearch = () => {
    if (!districtInput.trim()) return;
    setDistrict(districtInput);
  };

  // Filter + Sort
  const filteredCrops = crops
    .filter((crop) =>
      crop.commodity.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "asc"
        ? Number(a.modal_price) - Number(b.modal_price)
        : Number(b.modal_price) - Number(a.modal_price)
    );

  return (
    <div className="p-6">
    <div className="relative h-60 w-full mb-8">
  <img
    src="https://res.cloudinary.com/purnesh/image/upload/f_auto/v1500106898/azadpur-header00.jpg"
    alt="Market"
    className="w-full h-full object-cover rounded-xl "
  />
  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 flex flex-col items-center justify-center rounded-xl px-6 text-center">
    <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
      Market Prices
    </h1>
    <p className="mt-3 text-lg md:text-xl text-gray-200 max-w-2xl">
      Get the latest mandi prices of crops in your district — 
      stay updated, make smarter selling & buying decisions.
    </p>
    <button className="mt-5 px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg transition">
      Explore Prices
    </button>
  </div>
</div>

      {/* Search Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">

        {/* District Input */}
        <input
          type="text"
          placeholder="Search district (e.g. Lucknow)"
          value={districtInput}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setDistrictInput(e.target.value)
          }
          className="px-4 py-2 border rounded-lg w-full md:w-1/3"
        />

        {/* 🔥 NEW Search Button */}
        <button
          onClick={handleDistrictSearch}
          className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition"
        >
          Search District
        </button>

        {/* Crop Search */}
        <input
          type="text"
          placeholder="Search crops..."
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
          className="px-4 py-2 border rounded-lg w-full md:w-1/3"
        />

        {/* Sort */}
        <select
          value={sortOrder}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setSortOrder(e.target.value as "asc" | "desc")
          }
          className="px-4 py-2 border rounded-lg"
        >
          <option value="asc">Price: Low → High</option>
          <option value="desc">Price: High → Low</option>
        </select>
      </div>

      {/* Crop Grid */}
      {loading ? (
        <p className="text-center text-gray-600">Loading market prices...</p>
      ) : filteredCrops.length === 0 ? (
        <p className="text-center text-gray-500">
          No data found for "{district}"
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrops.map((crop, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold">
                {crop.commodity}
              </h2>
              <p className="text-gray-500 text-sm">
                {crop.variety} | {crop.grade}
              </p>
              <p className="text-green-700 font-medium">
                ₹{crop.modal_price} / quintal
              </p>
              <p className="text-sm text-gray-500">
                📍 {crop.market} Market
              </p>
              <p className="text-xs text-gray-400">
                Min: ₹{crop.min_price} | Max: ₹{crop.max_price}
              </p>
              <p className="text-xs text-gray-400">
                Arrival: {crop.arrival_date}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketPrice;