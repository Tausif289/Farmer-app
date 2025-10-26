import React from 'react';
import { useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/crop-recommendation':
        return 'Crop Recommendation';
      case '/farming-guide':
        return 'Crop Farming Guide';
      case '/market-price':
        return 'Market Price';
      case '/weather-forecast':
        return 'Weather Forecast';
      default:
        return null;
    }
  };

  const title = getPageTitle();

  // 🔹 Render nothing if no title
  if (!title) return null;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
    </header>
  );
};

export default Header;
