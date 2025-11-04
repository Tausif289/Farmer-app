"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import CropCards from "../components/CropCards";
import {
  Sprout,
  DollarSign,
  Cloud,
  TrendingUp,
  Users,
  Award,
  BarChart3,
} from "lucide-react";

interface CropData {
  _id: string;
  cropType: string;
  fertilizerUsed: string;
  pestUsed: string;
  lastFertilizingDate: string;
  lastPestDate: string;
}

const Dashboard: React.FC = () => {
  const [crops, setCrops] = useState<CropData[]>([]);
  const token = localStorage.getItem("token"); // 🔑 Auth token
  const navigate = useNavigate();
  // ✅ Fetch crops from backend
  const fetchCrops = async () => {
    try {
      const res = await axios.get("https://farmer-app-backend-ocin.onrender.com/api/crops", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCrops(res.data);
    } catch (err) {
      console.error("Error fetching crops:", err);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  // ✅ Add crop
  const handleAdd = async (newCrop: CropData) => {
    try {
      const res = await axios.post("https://farmer-app-backend-ocin.onrender.com/api/crops", newCrop, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCrops((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Error adding crop:", err);
    }
  };

  // ✅ Edit crop
  const handleEdit = async (id: string) => {
    const updatedName = prompt("Enter new crop name:");
    if (!updatedName) return;

    try {
      const res = await axios.put(
        `https://farmer-app-backend-ocin.onrender.com/api/crops/${id}`,
        { cropName: updatedName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCrops((prev) =>
        prev.map((c) => (c._id === id ? { ...c, ...res.data } : c))
      );
    } catch (err) {
      console.error("Error editing crop:", err);
    }
  };

  // ✅ Delete crop
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`https://farmer-app-backend-ocin.onrender.com/api/crops/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCrops((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Error deleting crop:", err);
    }
  };

  // ✅ Optional: Get All Crops (for admin view)
  const fetchAllCrops = async () => {
    try {
      const res = await axios.get("https://farmer-app-backend-ocin.onrender.com/api/crops/all");
      console.log("All crops:", res.data);
    } catch (err) {
      console.error("Error fetching all crops:", err);
    }
  };

  const summaryCards = [
    { title: "Active Crops", value: crops.length.toString(), icon: Sprout, color: "bg-green-100 text-green-600" },
    { title: "Market Value", value: "$24,500", icon: DollarSign, color: "bg-blue-100 text-blue-600" },
    { title: "Weather Score", value: "85%", icon: Cloud, color: "bg-purple-100 text-purple-600" },
    { title: "Growth Rate", value: "+12%", icon: TrendingUp, color: "bg-orange-100 text-orange-600" },
  ];

  const activities = [
    { title: "Planted Wheat", details: "Farmer John planted wheat in field A.", status: "Completed" },
    { title: "Tomato Harvest", details: "Harvested 500kg of tomatoes.", status: "Pending" },
    { title: "Weather Update", details: "Rain expected tomorrow.", status: "Info" },
  ];

  const activityColors = ["bg-green-50 border-green-100", "bg-blue-50 border-blue-100", "bg-orange-50 border-orange-100"];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-600 to-green-500 rounded-xl overflow-hidden shadow-lg">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/1595108/pexels-photo-1595108.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Golden wheat field"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative p-8 text-white">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-bold mb-4">Welcome to Agro Dashboard</h2>
            <p className="text-green-100 text-lg mb-6">Monitor crops, weather, and market trends in real time.</p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-2">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span className="font-medium">Farmers: 120</span>
                </div>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-2">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span className="font-medium">Awards: 5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Section */}
      <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Dashboard Overview</h3>
            <p className="text-gray-600">Summary of your farm's performance and status.</p>
          </div>
          <BarChart3 className="w-12 h-12 text-green-500" />
        </div>
      </div>

      {/* Crop Cards (with routes) */}
      <div className="p-4">
        <CropCards crops={crops} onDelete={handleDelete} onAdd={handleAdd} />
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Recent Activities</h3>
          <button className="text-green-600 hover:text-green-700 font-medium text-sm">View All</button>
        </div>
        <div className="space-y-4">
          {activities.map((activity, i) => (
            <div key={i} className={`flex items-center space-x-4 p-4 ${activityColors[i]} rounded-lg border`}>
              <img
                src="https://images.pexels.com/photos/1595108/pexels-photo-1595108.jpeg?auto=compress&cs=tinysrgb&w=100"
                alt="Activity"
                className="w-12 h-12 object-cover rounded-lg"
              />
              <div>
                <p className="font-medium text-gray-800">{activity.title}</p>
                <p className="text-sm text-gray-600">{activity.details}</p>
              </div>
              <div className="ml-auto">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">{activity.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button onClick={() => navigate("/crop-recommendation")} className="p-4 text-left bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-lg transition-all duration-200 border border-green-200">
            <Sprout className="w-8 h-8 text-green-600 mb-3" />
            <h4 className="font-semibold text-gray-800 mb-1">Crop Recommendations</h4>
            <p className="text-sm text-gray-600">Get suggestions for the best crops to plant this season.</p>
          </button>

          <button onClick={() => navigate("/market-price")} className="p-4 text-left bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-lg transition-all duration-200 border border-blue-200">
            <DollarSign className="w-8 h-8 text-blue-600 mb-3" />
            <h4 className="font-semibold text-gray-800 mb-1">Market Prices</h4>
            <p className="text-sm text-gray-600">View current crop prices in local markets.</p>
          </button>

          <button onClick={() => navigate("/weather-forecast")} className="p-4 text-left bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-lg transition-all duration-200 border border-purple-200">
            <Cloud className="w-8 h-8 text-purple-600 mb-3" />
            <h4 className="font-semibold text-gray-800 mb-1">Weather Forecast</h4>
            <p className="text-sm text-gray-600">Check upcoming weather conditions for your farm.</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
