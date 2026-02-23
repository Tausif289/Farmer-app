import React, { useContext, useState } from "react";
import { Star, MapPin, Calendar } from "lucide-react";
import soilCropRecommendations from "../assets/assets";
import { AppContext } from "../context/appcontext";

export interface Crop {
  id: number;
  name: string;
  image: string;
  description: string;
  days: number;
  months: string;
  region: string;
}

const CropRecommendation: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("AppContext must be used within AppContextProvider");
  }

  const { soiltype } = context;

  const soiltypes = [
    "Alluvial Soil",
    "Black Soil (Regur)",
    "Red Soil",
    "Laterite Soil",
    "Desert Soil",
    "Mountain Soil",
    "Saline Soil",
    "Peaty Soil",
  ];

  // Default from context or first soil
  const [selectedSoil, setSelectedSoil] = useState<string>(
    soiltype || soiltypes[0]
  );

  // Get crops
  const recommendations: Crop[] =
    soilCropRecommendations[selectedSoil] || [];

  return (
    <div className="space-y-6 p-6">
      
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-4">
          <img
            src="https://images.pexels.com/photos/1595108/pexels-photo-1595108.jpeg?auto=compress&cs=tinysrgb&w=200"
            alt="Crop field"
            className="w-24 h-24 object-cover rounded-lg"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Personalized Crop Recommendations
            </h2>
            <p className="text-gray-600">
              Selected Soil Type:{" "}
              <span className="font-semibold text-green-600">
                {selectedSoil}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Soil Dropdown */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">Select Soil Type</h2>

        <select
          value={selectedSoil}
          onChange={(e) => setSelectedSoil(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        >
          {soiltypes.map((soil) => (
            <option key={soil} value={soil}>
              {soil}
            </option>
          ))}
        </select>
      </div>

      {/* Crop Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((crop) => (
          <div
            key={crop.id}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <img
              src={crop.image}
              alt={crop.name}
              className="w-full h-48 object-cover rounded-t-xl"
            />

            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {crop.name}
              </h3>

              <p className="text-gray-600 text-sm mb-4">
                {crop.description}
              </p>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Growing Months: {crop.months}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Region: {crop.region}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>Days to Harvest: {crop.days}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {recommendations.length === 0 && (
        <div className="text-center text-gray-500 mt-6">
          No crop recommendations available for this soil type.
        </div>
      )}
    </div>
  );
};

export default CropRecommendation;