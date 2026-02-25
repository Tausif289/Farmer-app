import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Leaf,
  CloudSun,
  ShoppingBag,
  BookOpen,
  ArrowRight,
} from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  link: string;
}

interface StepCardProps {
  step: string;
  title: string;
  children: React.ReactNode;
}

const Home = () => {
  const [showVideo, setShowVideo] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(
    !localStorage.getItem("visited")
  );

  useEffect(() => {
    if (!localStorage.getItem("visited")) {
      localStorage.setItem("visited", "true");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">

      {/* ================= HERO SECTION ================= */}
      <section
        className="relative flex items-center justify-center text-center text-white 
        mx-4 my-6 rounded-3xl shadow-2xl overflow-hidden aspect-[2/1] lg:aspect-[3/1]"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/premium-photo/field-green-crops-with-sunset-background_996379-1558.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 "></div>

        <div className="relative px-6 flex flex-col items-center">
         <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl 
font-extrabold mb-6 leading-tight tracking-tight px-4">
  Welcome to{" "}
  <span className="text-green-500 block sm:inline">
    Farmers AI
  </span>
</h1>

          <p className="hidden md:block text-xl max-w-3xl mb-8 text-green-100">
            AI-powered crop prediction, weather forecasting,
            and smart market insights for modern farmers.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/login"
              className="px-6 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-xl 
              hover:bg-yellow-300 transition"
            >
              Login
            </Link>

            <Link
              to="/dashboard"
              className="px-6 py-3 bg-white/20 backdrop-blur-md border border-white/30
              text-white font-semibold rounded-xl hover:bg-white/30 transition"
            >
              Continue  →
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="grid md:grid-cols-4 gap-8 px-6 max-w-7xl mx-auto py-16">
        <FeatureCard
          icon={<Leaf size={42} />}
          title="Crop Recommendation"
          desc="AI-based crop suggestions using soil data."
          link="/crop-recommendation"
        />
        <FeatureCard
          icon={<ShoppingBag size={42} />}
          title="Market Prices"
          desc="Live mandi prices & profit insights."
          link="/market-price"
        />
        <FeatureCard
          icon={<CloudSun size={42} />}
          title="Weather Forecast"
          desc="5-day accurate weather predictions."
          link="/weather-forecast"
        />
        <FeatureCard
          icon={<BookOpen size={42} />}
          title="Farming Guide"
          desc="Modern farming techniques & pest control."
          link="/farming-guide"
        />
      </section>

      {/* ================= HOW TO USE ================= */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-green-800 mb-12">
            How to Use Farmers AI
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            <StepCard step="1" title="Login or Continue">
              <p>Access account or explore as guest.</p>
            </StepCard>

            <StepCard step="2" title="Use Smart Features">
              <p>Check crop, market, weather & guides.</p>
            </StepCard>

            <StepCard step="3" title="Increase Profit">
              <p>Plan smartly and grow better yield.</p>
            </StepCard>
          </div>
        </div>
      </section>

      {/* ================= TIMELINE ================= */}
      <section className="py-20 bg-green-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-green-800">
            Your Smart Farming Journey
          </h2>

          <div className="border-l-4 border-green-600 pl-8 space-y-10">
            <p>🌱 Enter Soil Data → Get AI Crop Suggestion</p>
            <p>📈 Compare Market Prices</p>
            <p>🌦 Check Weather Forecast</p>
            <p>💰 Harvest & Sell at Best Time</p>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-gradient-to-r from-green-700 to-green-900 text-white text-center py-16 px-6">
        <h2 className="text-4xl font-bold mb-6">
          Grow Smarter with AI
        </h2>

        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-green-800 
          rounded-2xl hover:scale-105 transition"
        >
          Start Exploring <ArrowRight size={20} />
        </Link>
      </section>

      {/* ================= VIDEO MODAL ================= */}
      {showVideo && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[90%] md:w-[700px] relative">
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-3 right-3"
            >
              ✕
            </button>
            <iframe
              className="w-full h-[400px]"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Tutorial"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* ================= ONBOARDING ================= */}
      {showOnboarding && (
        <div className="fixed bottom-6 right-6 bg-green-700 text-white p-6 rounded-2xl shadow-2xl w-80 z-50">
          <h4 className="font-bold mb-2">👋 Welcome to Farmers AI</h4>
          <p className="text-sm mb-4">
            Explore AI crop prediction & smart insights.
          </p>
          <button
            onClick={() => setShowOnboarding(false)}
            className="bg-white text-green-700 px-4 py-2 rounded-lg text-sm"
          >
            Got It
          </button>
        </div>
      )}

     

    </div>
  );
};

/* ================= COMPONENTS ================= */

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  desc,
  link,
}) => (
  <div className="bg-white shadow-lg rounded-2xl p-8 text-center hover:shadow-2xl transition">
    <div className="mb-4 flex justify-center text-green-600">{icon}</div>
    <h2 className="text-xl font-bold mb-3">{title}</h2>
    <p className="text-gray-600 mb-4">{desc}</p>
    <Link to={link} className="text-green-600 font-semibold hover:underline">
      Explore →
    </Link>
  </div>
);

const StepCard: React.FC<StepCardProps> = ({
  step,
  title,
  children,
}) => (
  <div className="relative bg-green-50 p-8 rounded-2xl shadow-lg">
    <div className="absolute -top-6 left-6 w-12 h-12 bg-green-600 text-white 
    rounded-full flex items-center justify-center text-xl font-bold animate-bounce">
      {step}
    </div>
    <h3 className="text-2xl font-semibold text-green-700 mt-6 mb-4">
      {title}
    </h3>
    <div className="text-gray-600">{children}</div>
  </div>
);

export default Home;