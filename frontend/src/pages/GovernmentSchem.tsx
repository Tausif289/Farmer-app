import React from "react";

interface Scheme {
  title: string;
  description: string;
  link?: string; // optional link for more details
}

const schemes: Scheme[] = [
  {
    title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    description:
      "Provides crop insurance to protect farmers against crop loss due to natural calamities, pests, and diseases.",
    link: "https://pmfby.gov.in/",
  },
  {
    title: "Kisan Credit Card (KCC) Scheme",
    description:
      "Offers farmers timely access to short-term credit for cultivation, buying seeds, fertilizers, and other agricultural needs.",
    link: "https://www.rbi.org.in/",
  },
  {
    title: "Soil Health Card Scheme",
    description:
      "Helps farmers get information about soil nutrient status and guidance on fertilizers for better crop yields.",
  },
  {
    title: "National Agriculture Market (eNAM)",
    description:
      "An online trading platform for farmers to get better price discovery and access to multiple markets.",
    link: "https://www.enam.gov.in/",
  },
  {
    title: "Rashtriya Krishi Vikas Yojana (RKVY)",
    description:
      "Promotes agricultural development by supporting innovative projects and farm infrastructure.",
    link: "https://rkvy.nic.in/",
  },
  {
    title: "Pradhan Mantri Krishi Sinchai Yojana (PMKSY)",
    description:
      "Aims to improve irrigation coverage and water use efficiency in agriculture.",
    link: "https://pmksy.gov.in/",
  },
  {
    title: "Paramparagat Krishi Vikas Yojana (PKVY)",
    description:
      "Supports organic farming and provides training for sustainable agricultural practices.",
  },
  {
    title: "Sub-Mission on Agriculture Mechanization (SMAM)",
    description:
      "Provides subsidies for modern farming tools and equipment to improve productivity.",
  },
];

const GovtSchemes: React.FC = () => {
  return (
    <div className="min-h-screen bg-green-50">
      {/* Hero Section */}
      <div className="relative w-full h-64 md:h-96 bg-green-700 rounded-3xl overflow-hidden flex items-center justify-center mb-10">
        <img
          src="https://www.bankofbaroda.in/-/media/project/bob/countrywebsites/india/blogs/savings/images/government-schemes-for-women-that-you-should-know.jpg"
          alt="Government Schemes"
          className="absolute w-full h-full object-cover opacity-80"
        />
        <div className="relative text-center text-blue-900 px-6">
          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            Government Schemes for Farmers
          </h1>
          <p className="text-lg md:text-xl  text-bold">
            Access crop insurance, loans, modern tools, and market support to boost your farming journey.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Introduction */}
        <p className="text-gray-700 mb-8 max-w-3xl text-center mx-auto">
          Explore various government schemes available to farmers for crop insurance, loans, soil health, irrigation, organic farming, and market support.
        </p>

        {/* Grid of Schemes */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemes.map((scheme, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <h2 className="text-xl font-semibold mb-2 text-green-700">
                {scheme.title}
              </h2>
              <p className="text-gray-600 mb-4">{scheme.description}</p>
              {scheme.link && (
                <a
                  href={scheme.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 font-medium hover:underline"
                >
                  Learn More →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GovtSchemes;
