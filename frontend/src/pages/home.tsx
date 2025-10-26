import React from "react";
import { Link } from "react-router-dom";
import { Leaf, CloudSun, ShoppingBag, BookOpen } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-green-50">
    <section
  className="relative flex items-center justify-center text-center text-white 
       mx-4 sm:mx-6 my-6 sm:my-8 rounded-3xl shadow-2xl overflow-hidden
       aspect-[2/1] md:aspect-[2/1] lg:aspect-[3/1]"
  style={{
    backgroundImage:
      "url('https://img.freepik.com/premium-photo/field-green-crops-with-sunset-background_996379-1558.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  {/* Overlay */}
  <div className="absolute inset-0 bg-black/40"></div>

  {/* Text Content */}
  <div className="relative px-4 md:px-12 lg:px-20 flex flex-col items-center justify-center">
    {/* Header */}
    <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4 drop-shadow-[0_3px_6px_rgba(0,0,0,0.7)] tracking-wide">
      Smart Crop Advisory
    </h1>

    {/* Paragraph */}
    <p className="hidden md:block text-base sm:text-lg md:text-xl lg:text-2xl font-medium max-w-3xl mx-auto mb-8 leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
      Empowering farmers with{" "}
      <span className="font-semibold text-yellow-300">
        AI-driven crop recommendations
      </span>
      , real-time{" "}
      <span className="font-semibold text-green-200">market insights</span>, and{" "}
      <span className="font-semibold text-blue-200">weather forecasting</span>{" "}
      for smarter farming decisions.
    </p>

    {/* Buttons */}
    <div className="w-full max-w-sm mx-auto px-2 mt-4">
      <div className="flex flex-row gap-3 justify-center">
        <Link
          to="/login"
          className="w-28 sm:w-32 px-4 py-2 sm:py-3 bg-yellow-400 text-gray-900 text-base sm:text-lg font-semibold 
                   rounded-xl shadow-lg shadow-black/30 hover:bg-yellow-300 hover:shadow-2xl 
                   transform hover:-translate-y-1 transition-all text-center"
        >
          Login
        </Link>
        <Link
          to="/login"
          className="w-28 sm:w-32 px-4 py-2 sm:py-3 bg-green-500 text-white text-base sm:text-lg font-semibold 
                   rounded-xl shadow-lg shadow-black/30 hover:bg-green-400 hover:shadow-2xl 
                   transform hover:-translate-y-1 transition-all text-center"
        >
          Sign Up
        </Link>
      </div>
    </div>
  </div>
</section>

<div className="mt-16 relative">
              <img
                src="https://media.istockphoto.com/id/806276128/photo/farmer-ploughing-rice-field-at-sunrise.jpg?s=612x612&w=0&k=20&c=t5IUOH9GWrI1lAz4gXPJnwjR9WUxQxdmSnIJxk_XDiQ="
                alt="Farmer ploughing a rice field with two cattle at sunrise."
                data-ai-hint="farmer ploughing"
                width={1200}
                height={600}
                className="rounded-xl shadow-2xl mx-auto object-cover h-[600px]"
              />
              <div className="absolute inset-0 bg-black/30 rounded-xl flex items-end p-8 text-white">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                        <p className="font-bold">Primary Livelihood</p>
                        <p className="text-sm">Over 55% of India’s population depends on agriculture.</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                        <p className="font-bold">GDP Contribution</p>
                        <p className="text-sm">Around 17–20% of India’s GDP comes from agriculture and allied sectors.</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                        <p className="font-bold">Global Rank</p>
                        <p className="text-sm">India is second worldwide in farm output and first in net cropped area.</p>
                    </div>
                </div>
              </div>
            </div>

      {/* Features Section */}
      <section className="grid md:grid-cols-4 gap-6 px-6 max-w-6xl mx-auto py-12">
        <div className="bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-lg transition">
          <Leaf className="mx-auto text-green-600 mb-4" size={40} />
          <h2 className="text-xl font-semibold mb-2">Crop Recommendation</h2>
          <p className="text-gray-600">
            Get personalized crop suggestions based on soil, season, and region.
          </p>
          <Link
            to="/crop-recommendation"
            className="text-green-600 font-medium mt-3 inline-block hover:underline"
          >
            Explore →
          </Link>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-lg transition">
          <ShoppingBag className="mx-auto text-yellow-600 mb-4" size={40} />
          <h2 className="text-xl font-semibold mb-2">Market Prices</h2>
          <p className="text-gray-600">
            Check real-time prices of crops in your local markets.
          </p>
          <Link
            to="/market-price"
            className="text-green-600 font-medium mt-3 inline-block hover:underline"
          >
            Explore →
          </Link>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-lg transition">
          <CloudSun className="mx-auto text-blue-600 mb-4" size={40} />
          <h2 className="text-xl font-semibold mb-2">Weather Forecast</h2>
          <p className="text-gray-600">
            Get 10-day weather forecasts to plan farming activities better.
          </p>
          <Link
            to="/weather-forecast"
            className="text-green-600 font-medium mt-3 inline-block hover:underline"
          >
            Explore →
          </Link>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-lg transition">
          <BookOpen className="mx-auto text-purple-600 mb-4" size={40} />
          <h2 className="text-xl font-semibold mb-2">Farming Guide</h2>
          <p className="text-gray-600">
            Learn modern techniques, pest control, and best farming practices.
          </p>
          <Link
            to="/farming-guide"
            className="text-green-600 font-medium mt-3 inline-block hover:underline"
          >
            Explore →
          </Link>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-green-700 text-white text-center py-12 px-6 mt-12">
        <h2 className="text-3xl font-bold mb-4">
          Start Your Smart Farming Journey
        </h2>
        <p className="mb-6 text-lg">
          Join thousands of farmers who are already growing smarter with AI.
        </p>
        <Link
          to="/dashboard"
          className="px-6 py-3 bg-white text-green-700 text-lg rounded-2xl shadow-md hover:bg-gray-200 transition"
        >
          Go to Dashboard
        </Link>
      </section>
    </div>
  );
};

export default Home;
