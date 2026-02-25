// components/TranslatedText.tsx
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/appcontext";

interface TranslatedTextProps {
  children: string;
}

const TranslatedText: React.FC<TranslatedTextProps> = ({ children }) => {
    const context=useContext(AppContext);
 if (!context) {
    throw new Error("AppContext must be used within AppContextProvider");
  }
  const { language } = context;
  const [translated, setTranslated] = useState(children);

  useEffect(() => {
    if (language === "en") {
      setTranslated(children);
      return;
    }

    const translate = async () => {
      try {
        const res = await fetch("https://backend-foarmer-app.onrender.com/api/translate/batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ texts: [children], targetLang: language }),
        });
        const data = await res.json();
        setTranslated(data.translated?.[0] || children);
      } catch {
        setTranslated(children);
      }
    };

    translate();
  }, [language, children]);

  return <>{translated}</>;
};

export default TranslatedText;
