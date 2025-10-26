import React, { useState } from "react";

interface CropData {
  _id: string;
  cropType: string;
  fertilizerUsed: string;
  pestUsed: string;
  lastFertilizingDate: string;
  lastPestDate: string;
}

interface CropTableProps {
  crops: CropData[];
  onAdd: (crop: CropData) => void;      // Can handle add or update
  onDelete: (id: string) => void;
}

const CropTable: React.FC<CropTableProps> = ({ crops, onAdd, onDelete }) => {
  const [showForm, setShowForm] = useState(false);
  const [currentCrop, setCurrentCrop] = useState<CropData | null>(null);
  const [formData, setFormData] = useState<CropData>({
    _id: "",
    cropType: "",
    fertilizerUsed: "",
    pestUsed: "",
    lastFertilizingDate: "",
    lastPestDate: "",
  });

  // Prefill form inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add or update crop
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentCrop) {
      // Updating existing crop
      onAdd({ ...formData, _id: currentCrop._id });
    } else {
      // Adding new crop
      onAdd({ ...formData, _id: Date.now().toString() });
    }

    // Reset form
    setFormData({
      _id: "",
      cropType: "",
      fertilizerUsed: "",
      pestUsed: "",
      lastFertilizingDate: "",
      lastPestDate: "",
    });
    setCurrentCrop(null);
    setShowForm(false);
  };

  // Open form with selected crop
  const handleEditClick = (crop: CropData) => {
    setCurrentCrop(crop);
    setFormData(crop);
    setShowForm(true);
  };

  return (
    <div className="w-full space-y-6 p-4">
      {/* Add/Edit Crop Button */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm) setCurrentCrop(null); // Reset if opening new
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition text-sm"
        >
          {showForm ? "Close Form" : currentCrop ? "Edit Crop" : "Add Crop"}
        </button>
      </div>

      {/* Crop Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-xl p-6 flex flex-col space-y-4"
        >
          <input
            type="text"
            name="cropType"
            value={formData.cropType}
            onChange={handleChange}
            placeholder="Crop Name"
            className="border p-3 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-green-400 focus:outline-none"
            required
          />
          <input
            type="text"
            name="fertilizerUsed"
            value={formData.fertilizerUsed}
            onChange={handleChange}
            placeholder="Fertilizer Name"
            className="border p-3 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-green-400 focus:outline-none"
            required
          />
          <input
            type="text"
            name="pestUsed"
            value={formData.pestUsed}
            onChange={handleChange}
            placeholder="Pest Name"
            className="border p-3 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-green-400 focus:outline-none"
            required
          />
          <input
            type="date"
            name="lastFertilizingDate"
            value={formData.lastFertilizingDate}
            onChange={handleChange}
            className="border p-3 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-green-400 focus:outline-none"
            required
          />
          <input
            type="date"
            name="lastPestDate"
            value={formData.lastPestDate}
            onChange={handleChange}
            className="border p-3 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-green-400 focus:outline-none"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition text-sm sm:text-base"
          >
            {currentCrop ? "Update Crop" : "Save Crop"}
          </button>
        </form>
      )}

      {/* Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm rounded-xl shadow-md">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Crop</th>
              <th className="px-4 py-2 text-left">Fertilizer</th>
              <th className="px-4 py-2 text-left">Pest</th>
              <th className="px-4 py-2 text-left">Last Fertilizing</th>
              <th className="px-4 py-2 text-left">Last Pesticide</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.isArray(crops) && crops.length > 0 ? (
              crops.map((crop) => (
                <tr
                  key={crop._id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-4 py-2">{crop.cropType}</td>
                  <td className="px-4 py-2">{crop.fertilizerUsed}</td>
                  <td className="px-4 py-2">{crop.pestUsed}</td>
                  <td className="px-4 py-2">
                    {crop.lastFertilizingDate
                      ? new Date(crop.lastFertilizingDate).toLocaleDateString(
                          "en-GB"
                        )
                      : "-"}
                  </td>
                  <td className="px-4 py-2">
                    {crop.lastPestDate
                      ? new Date(crop.lastPestDate).toLocaleDateString("en-GB")
                      : "-"}
                  </td>
                  <td className="px-4 py-2 text-center flex flex-col sm:flex-row sm:justify-center sm:space-x-3 space-y-1 sm:space-y-0">
                    <button
                      onClick={() => handleEditClick(crop)}
                      className="px-4 py-1 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(crop._id)}
                      className="px-4 py-1 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-center text-gray-500 py-4 font-medium"
                >
                  No crops found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Card View for Mobile */}
      <div className="md:hidden space-y-4">
        {Array.isArray(crops) && crops.length > 0 ? (
          crops.map((crop) => (
            <div
              key={crop._id}
              className="bg-white shadow-lg rounded-xl p-4 space-y-2"
            >
              <h3 className="font-bold text-lg text-green-600">{crop.cropType}</h3>
              <div>
                <span className="font-medium">Fertilizer: </span>
                {crop.fertilizerUsed}
              </div>
              <div>
                <span className="font-medium">Pest: </span>
                {crop.pestUsed}
              </div>
              <div>
                <span className="font-medium">Last Fertilizing: </span>
                {crop.lastFertilizingDate
                  ? new Date(crop.lastFertilizingDate).toLocaleDateString("en-GB")
                  : "-"}
              </div>
              <div>
                <span className="font-medium">Last Pesticide: </span>
                {crop.lastPestDate
                  ? new Date(crop.lastPestDate).toLocaleDateString("en-GB")
                  : "-"}
              </div>
              <div className="flex space-x-3 mt-2">
                <button
                  onClick={() => handleEditClick(crop)}
                  className="flex-1 px-4 py-1 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(crop._id)}
                  className="flex-1 px-4 py-1 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No crops found</p>
        )}
      </div>
    </div>
  );
};

export default CropTable;
