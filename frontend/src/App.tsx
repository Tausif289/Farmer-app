
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/DashBoard.tsx';
import CropRecommendation from './pages/CropRecommendation';
import CropFarmingGuide from './pages/CropFarmingGuide';
import MarketPrice from './pages/MarketPrice.tsx';
import WeatherForecast from './pages/WeatherForecast';
import Home from './pages/home.tsx'
import Schems from './pages/GovernmentSchem.tsx';
import Seeds from './pages/Formingmaterials.tsx';
import Profile from './pages/Profile.tsx';
import CropHealth from './pages/Crophealth.tsx';
import AskQuestion from './pages/Askquestion.tsx';
import ScrollToTop from './components/ScrolPages.tsx';
import SoilHealth from './pages/Soilhealth.tsx';



function App() {
  return (
    <Router>
       <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile/>} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/crop-recommendation" element={<CropRecommendation />} />
              <Route path="/Soil-health" element={<SoilHealth/>} />
              <Route path="/crop-health" element={<CropHealth/>} />
              <Route path="/farming-guide" element={<CropFarmingGuide />} />
              <Route path="/market-price" element={<MarketPrice />} />
              <Route path="/weather-forecast" element={<WeatherForecast />} />
              <Route path="/govshemes" element={<Schems />} />
              <Route path="/feedback" element={<Seeds/>} />
              <Route path="/ask-question" element={<AskQuestion />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;