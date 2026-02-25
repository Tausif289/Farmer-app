import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Dashboard from "./pages/DashBoard";
import CropRecommendation from "./pages/CropRecommendation";
import CropFarmingGuide from "./pages/CropFarmingGuide";
import MarketPrice from "./pages/MarketPrice";
import WeatherForecast from "./pages/WeatherForecast";
import Home from "./pages/home";
import Schems from "./pages/GovernmentSchem";
import Seeds from "./pages/Formingmaterials";
import Profile from "./pages/Profile";
import CropHealth from "./pages/Crophealth";
import AskQuestion from "./pages/Askquestion";
import ScrollToTop from "./components/ScrolPages";
import SoilHealth from "./pages/Soilhealth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <Router>
      <ScrollToTop />

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Layout Routes */}
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/crop-recommendation" element={<CropRecommendation />} />
                <Route path="/soil-health" element={<SoilHealth />} />
                <Route path="/crop-health" element={<CropHealth />} />
                <Route path="/farming-guide" element={<CropFarmingGuide />} />
                <Route path="/market-price" element={<MarketPrice />} />
                <Route path="/weather-forecast" element={<WeatherForecast />} />
                <Route path="/govshemes" element={<Schems />} />
                <Route path="/feedback" element={<Seeds />} />
                <Route path="/ask-question" element={<AskQuestion />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;