"use client";

import React, { useState, useEffect, useContext } from "react";
import { Globe } from "lucide-react";
import { useLocation } from "react-router-dom";
import { AppContext } from "../context/appcontext"; // adjust path

// Languages map
const languages: Record<string, string> = {
  en: "English",
  hi: "हिंदी",
  pa: "ਪੰਜਾਬੀ",
  bho: "भोजपुरी",
  bn: "বাংলা",
  ta: "தமிழ்",        // Tamil
  te: "తెలుగు",       // Telugu
  kn: "ಕನ್ನಡ",        // Kannada
  ml: "മലയാളം",       // Malayalam
  mr: "मराठी",        // Marathi
  gu: "ગુજરાતી",       // Gujarati
  or: "ଓଡ଼ିଆ",  
  ur: "اردو",       // Kashmiri
  kok: "कोंकणी",         // Sinhala
  sa: "संस्कृत",       // Sanskrit
};


const LanguageSelector: React.FC = () => {
  const context = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const location = useLocation(); // 👈 detect page change

  if (!context) {
    throw new Error("AppContext must be used within AppContextProvider");
  }
  const [language, setLanguage] = useState("en");

  // 🔹 Load saved language from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem("preferredLanguage");
    if (savedLang && savedLang !== language) {
      setLanguage(savedLang);
    }
  }, []);

  // 🔹 Save language to localStorage when changed
  const handleLanguageChange = (code: string) => {
    setLanguage(code);
    localStorage.setItem("preferredLanguage", code);
    setOpen(false);
  };

  useEffect(() => {
    async function translatePage(targetLang: string) {
      // if (targetLang === "en") return; // skip English

      const allTextNodes: Node[] = [];
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT
      );

      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (node.nodeValue && node.nodeValue.trim()) {
          allTextNodes.push(node);
        }
      }

      for (const node of allTextNodes) {
        const original = node.nodeValue || "";
        try {
          const res = await fetch("https://farmer-app-backend-ocin.onrender.com/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: original, targetLang }),
          });
          const data = await res.json();
          node.nodeValue = data.translated;
        } catch (err) {
          console.error("Translation failed", err);
        }
      }
    }

    translatePage(language);
  }, [language, location.pathname]); // 👈 run on language or page change

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center space-x-2 px-3 py-2 bg-white text-gray-800 rounded-lg shadow hover:bg-gray-100"
      >
        <Globe className="h-5 w-5" />
        <span>{languages[language] || "Language"}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-green-400 rounded-lg shadow-lg border border-gray-200 z-50 overflow-y-auto "  style={{ overscrollBehavior: "contain" }}>
          {Object.entries(languages).map(([code, label]) => (
            <button
              key={code}
              onClick={() => handleLanguageChange(code)}
              className={`block w-full text-left px-4 py-2 hover:bg-green-600 ${
                language === code ? "bg-green-600 text-white" : ""
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
