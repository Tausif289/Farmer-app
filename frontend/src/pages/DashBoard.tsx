"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import CropCards from "../components/CropCards";
import {
  Sprout,
  DollarSign,
  Cloud,
  Users,
  Award,
  BarChart3,
  Home,
  Leaf,
  Activity,
  BookOpen,
  Landmark,
  MessageSquare
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
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};

    const res = await axios.get(
      "http://localhost:4000/api/crops",
      config
    );

    setCrops(res.data);
  } catch (err) {
    console.error("Error fetching crops:", err);
  }
};

  useEffect(() => {
  if (!token) {
    setCrops([]); // or show message
    return;
  }

  fetchCrops();
}, [token]);
  // ✅ Add crop
  const handleAdd = async (newCrop: CropData) => {
  if (!token) {
    alert("Please login to add crops");
    return;
  }

  try {
    const res = await axios.post(
      "http://localhost:4000/api/crops",
      newCrop,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setCrops((prev) => [...prev, res.data]);
  } catch (err) {
    console.error("Error adding crop:", err);
  }
};

  // ✅ Delete crop
  const handleDelete = async (id: string) => {
  if (!token) {
    alert("Please login to delete crops");
    return;
  }

  try {
    await axios.delete(
      `http://localhost:4000/api/crops/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setCrops((prev) => prev.filter((c) => c._id !== id));
  } catch (err) {
    console.error("Error deleting crop:", err);
  }
};

  // ✅ Optional: Get All Crops (for admin view)

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
      {/* Crop Section Heading */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-3xl font-extrabold text-green-600 mb-2">
            🌾 Your Recent Crops
          </h3>
          <p className="text-gray-600 mb-4">
            Add, track, and manage your farm crops efficiently.
          </p>
        </div>

        <CropCards
          crops={crops}
          onDelete={handleDelete}
          onAdd={handleAdd}
        />
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
      <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          Quick Actions
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {/* Dashboard */}
          <button
            onClick={() => navigate("/dashboard")}
            className="group p-5 text-left bg-gradient-to-br from-emerald-50 to-emerald-100 
                 hover:from-emerald-100 hover:to-emerald-200 
                 rounded-xl transition-all duration-300 
                 border border-emerald-200 hover:shadow-lg hover:-translate-y-1"
          >
            <Home className="w-9 h-9 text-emerald-600 mb-4 group-hover:scale-110 transition" />
            <h4 className="font-semibold text-gray-800 text-lg mb-1">
              Dashboard
            </h4>
            <p className="text-sm text-gray-600">
              View your farm insights and recent activity.
            </p>
          </button>

          {/* Crop Recommendation */}
          <button
            onClick={() => navigate("/crop-recommendation")}
            className="group p-5 text-left bg-gradient-to-br from-green-50 to-green-100 
                 hover:from-green-100 hover:to-green-200 
                 rounded-xl transition-all duration-300 
                 border border-green-200 hover:shadow-lg hover:-translate-y-1"
          >
            <Sprout className="w-9 h-9 text-green-600 mb-4 group-hover:scale-110 transition" />
            <h4 className="font-semibold text-gray-800 text-lg mb-1">
              Crop Recommendations
            </h4>
            <p className="text-sm text-gray-600">
              Get AI-powered suggestions for the best crops this season.
            </p>
          </button>

          {/* Soil Health */}
          <button
            onClick={() => navigate("/soil-health")}
            className="group p-5 text-left bg-gradient-to-br from-amber-50 to-amber-100 
                 hover:from-amber-100 hover:to-amber-200 
                 rounded-xl transition-all duration-300 
                 border border-amber-200 hover:shadow-lg hover:-translate-y-1"
          >
            <Leaf className="w-9 h-9 text-amber-600 mb-4 group-hover:scale-110 transition" />
            <h4 className="font-semibold text-gray-800 text-lg mb-1">
              Soil Health
            </h4>
            <p className="text-sm text-gray-600">
              Analyze soil nutrients and improve productivity.
            </p>
          </button>

          {/* Crop Health */}
          <button
            onClick={() => navigate("/crop-health")}
            className="group p-5 text-left bg-gradient-to-br from-red-50 to-red-100 
                 hover:from-red-100 hover:to-red-200 
                 rounded-xl transition-all duration-300 
                 border border-red-200 hover:shadow-lg hover:-translate-y-1"
          >
            <Activity className="w-9 h-9 text-red-600 mb-4 group-hover:scale-110 transition" />
            <h4 className="font-semibold text-gray-800 text-lg mb-1">
              Crop Health
            </h4>
            <p className="text-sm text-gray-600">
              Detect diseases and monitor plant conditions.
            </p>
          </button>

          {/* Crop Farming Guide */}
          <button
            onClick={() => navigate("/farming-guide")}
            className="group p-5 text-left bg-gradient-to-br from-indigo-50 to-indigo-100 
                 hover:from-indigo-100 hover:to-indigo-200 
                 rounded-xl transition-all duration-300 
                 border border-indigo-200 hover:shadow-lg hover:-translate-y-1"
          >
            <BookOpen className="w-9 h-9 text-indigo-600 mb-4 group-hover:scale-110 transition" />
            <h4 className="font-semibold text-gray-800 text-lg mb-1">
              Crop Farming Guide
            </h4>
            <p className="text-sm text-gray-600">
              Step-by-step farming guidance for better yield.
            </p>
          </button>

          {/* Market Prices */}
          <button
            onClick={() => navigate("/market-price")}
            className="group p-5 text-left bg-gradient-to-br from-blue-50 to-blue-100 
                 hover:from-blue-100 hover:to-blue-200 
                 rounded-xl transition-all duration-300 
                 border border-blue-200 hover:shadow-lg hover:-translate-y-1"
          >
            <DollarSign className="w-9 h-9 text-blue-600 mb-4 group-hover:scale-110 transition" />
            <h4 className="font-semibold text-gray-800 text-lg mb-1">
              Crops Market Price
            </h4>
            <p className="text-sm text-gray-600">
              Check latest mandi and local market prices.
            </p>
          </button>

          {/* Weather Forecast */}
          <button
            onClick={() => navigate("/weather-forecast")}
            className="group p-5 text-left bg-gradient-to-br from-purple-50 to-purple-100 
                 hover:from-purple-100 hover:to-purple-200 
                 rounded-xl transition-all duration-300 
                 border border-purple-200 hover:shadow-lg hover:-translate-y-1"
          >
            <Cloud className="w-9 h-9 text-purple-600 mb-4 group-hover:scale-110 transition" />
            <h4 className="font-semibold text-gray-800 text-lg mb-1">
              Weather Forecast
            </h4>
            <p className="text-sm text-gray-600">
              Stay prepared with accurate weather updates.
            </p>
          </button>

          {/* Government Schemes */}
          <button
            onClick={() => navigate("/govshemes")}
            className="group p-5 text-left bg-gradient-to-br from-teal-50 to-teal-100 
                 hover:from-teal-100 hover:to-teal-200 
                 rounded-xl transition-all duration-300 
                 border border-teal-200 hover:shadow-lg hover:-translate-y-1"
          >
            <Landmark className="w-9 h-9 text-teal-600 mb-4 group-hover:scale-110 transition" />
            <h4 className="font-semibold text-gray-800 text-lg mb-1">
              Government Schemes
            </h4>
            <p className="text-sm text-gray-600">
              Explore latest agricultural schemes and subsidies.
            </p>
          </button>

          {/* Feedback */}
          <button
            onClick={() => navigate("/feedback")}
            className="group p-5 text-left bg-gradient-to-br from-pink-50 to-pink-100 
                 hover:from-pink-100 hover:to-pink-200 
                 rounded-xl transition-all duration-300 
                 border border-pink-200 hover:shadow-lg hover:-translate-y-1"
          >
            <MessageSquare className="w-9 h-9 text-pink-600 mb-4 group-hover:scale-110 transition" />
            <h4 className="font-semibold text-gray-800 text-lg mb-1">
              Feedback
            </h4>
            <p className="text-sm text-gray-600">
              Share your experience and suggestions with us.
            </p>
          </button>
          

        </div>
 {/* AI Chatbot Full Width Section */}
<div className="w-full mt-6">
  <div
    className="relative overflow-hidden rounded-3xl 
               bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 
               shadow-2xl"
  >

    {/* Soft Glow Background */}
    <div className="absolute inset-0 opacity-20">
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
    </div>

    <div className="relative px-6 py-8 md:px-12 md:py-12 text-white">
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto">

        {/* Icon */}
        <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl shadow-lg mb-4">
          <MessageSquare className="w-14 h-14 animate-pulse" />
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-4xl font-bold mb-4">
          🤖 Ask AI Farming Assistant
        </h2>

        {/* Description */}
        <p className="text-green-100 text-base md:text-lg mb-6 leading-relaxed">
          Get instant answers about crops, soil health, weather advice,
          fertilizers, pest control, and government schemes —
          powered by advanced AI technology.
        </p>

        {/* CTA Button */}
        <button
          onClick={() => navigate("/ask-question")}
          className="bg-white text-green-700 font-semibold 
                     px-6 py-3 text-base 
                     rounded-xl shadow-lg 
                     hover:scale-105 hover:shadow-xl 
                     transition-all duration-300"
        >
          Start Chatting →
        </button>

      </div>
    </div>
  </div>
</div>
      </div>
    </div>
  );
};

export default Dashboard;
