import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { 
  Home, 
  Lightbulb, 
  BookOpen, 
  DollarSign, 
  Cloud, 
  X, 
  Sprout,
  ShoppingBag, 
  Bug, 
  MessageCircle 
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [openLang, setOpenLang] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);


  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenLang(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { path: "/dashboard", name: "Dashboard", icon: Home },
    { path: "/crop-recommendation", name: "Crop Recommendation", icon: Lightbulb },
    { path: "/Soil-health", name: "Soil Health", icon: Sprout },
    { path: "/crop-health", name: "Crop Health", icon: Bug },
    { path: "/farming-guide", name: "Crop Farming Guide", icon: BookOpen },
    { path: "/market-price", name: "Crops Market Price", icon: ShoppingBag },
    { path: "/weather-forecast", name: "Weather Forecast", icon: Cloud },
    { path: "/govshemes", name: "Government Schemes", icon: Lightbulb },
    { path: "/feedback", name: "Feedback", icon: DollarSign },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-16 right-0 h-[calc(100vh-4rem)] w-80 bg-white shadow-xl z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          lg:translate-x-0 lg:static lg:sticky lg:top-16
        `}
      >
        <div className="p-4 h-full flex flex-col justify-start">
          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="lg:hidden absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Menu items */}
          <nav className="mt-8 space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-green-100 text-green-700 border-r-4 border-green-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            ))}

            {/* Divider */}
            <hr className="my-4 border-gray-300" />

           {/* Language Dropdown (Drop-Up) */}



            {/* Ask Question */}
            <NavLink
              to="/ask-question"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-green-100 text-green-700 border-r-4 border-green-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">Ask Question</span>
            </NavLink>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
