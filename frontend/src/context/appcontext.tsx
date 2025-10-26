import React, { createContext, useState,useEffect, type ReactNode } from "react";

interface AppContextType {
   language: string;
  setLanguage: (lang: string) => void;
  translate: (text: string) => Promise<string>;
  name: any;
  setName: React.Dispatch<React.SetStateAction<string>>;

  showlogin: boolean;
  setShowlogin: React.Dispatch<React.SetStateAction<boolean>>;

  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;

  // New fields with useState
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;

  mobilenumber: string;
  setMobilenumber: React.Dispatch<React.SetStateAction<string>>;

  state: string;
  setState: React.Dispatch<React.SetStateAction<string>>;

  district: string;
  setDistrict: React.Dispatch<React.SetStateAction<string>>;

  soiltype: string;
  setSoiltype: React.Dispatch<React.SetStateAction<string>>;
}


export const AppContext = createContext<AppContextType | null>(null);

interface AppContextProviderProps {
  children: ReactNode;  // ✅ ye add karna important hai
}


const AppContextProvider = ({ children }: AppContextProviderProps) => {
const [name, setName] = useState<any>(() => {
  const savedUser = localStorage.getItem("name");
  return savedUser ? JSON.parse(savedUser) : null;
});
const [showlogin, setShowlogin] = useState(false);
const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

// new states for farmer details
const [email, setEmail]  = useState<any>(() => {
  const savedUser = localStorage.getItem("email");
  return savedUser ? savedUser: "rakesh@gmail.com";
});
const  [mobilenumber, setMobilenumber]  = useState<any>(() => {
  const savedUser = localStorage.getItem("mobilenumber");
  return savedUser ? savedUser : "+91 9876543210"
});
const [state, setState] = useState<string>(() => {
  const saved = localStorage.getItem("state");
  return saved ? saved : "Uttar Pradesh";   // ✅ no JSON.parse
});

const [district, setDistrict]  = useState<string>(() => {
  const savedUser = localStorage.getItem("district");
  return savedUser ? savedUser : "Kanpur"
});

const[soiltype, setSoiltype]  = useState<any>(() => {
  const savedUser = localStorage.getItem("soiltype");
  return savedUser ? savedUser: "mountain soil"
});
 const [language, setLanguage] = useState<string>(() => {
  // ✅ Load from localStorage if exists, else default to "en"
  return localStorage.getItem("language") || "en";
});

// Persist language whenever it changes
useEffect(() => {
  if (language) {
    localStorage.setItem("language", language);
  }
}, [language]);

  const translate = async (text: string) => {
    if (language === "en") return text; // Skip if English
    try {
      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          text
        )}&langpair=en|${language}`
      );
      const data = await res.json();
      return data.responseData.translatedText || text;
    } catch (err) {
      console.error("Translation failed:", err);
      return text;
    }
  };


useEffect(() => {
  if (token) {
    localStorage.setItem("token", token);
    if (name) localStorage.setItem("name", JSON.stringify(name));
    if (state) localStorage.setItem("state", state);
    if (district) localStorage.setItem("district",district);
    if (email) localStorage.setItem("email", email);
    if (soiltype) localStorage.setItem("soiltype",soiltype);
    if(mobilenumber) localStorage.setItem("mobilenumber",mobilenumber)
  } else {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("state");
    localStorage.removeItem("email");
    localStorage.removeItem("soiltype");
    localStorage.removeItem("district");
    localStorage.removeItem("mobilenumber");
  }
}, [token, name,state, district,email,soiltype,mobilenumber]);

  useEffect(() => {
    // On app load, check localStorage
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("name");
    const savedState = localStorage.getItem("state");
    const savedDistrict = localStorage.getItem("district");
    const saveEmail =localStorage.getItem("email");
    const savesoiltype=localStorage.getItem('soiltype');
    const savemobilenumber=localStorage.getItem('mobilenumber');
   
    if (savedToken) setToken(savedToken);
    if (savedUser) setName(JSON.parse(savedUser));
    if (savedState) setState(savedState);
    if (savedDistrict) setDistrict(savedDistrict);
    if (saveEmail) setEmail(saveEmail);
    if (savesoiltype) setSoiltype(savesoiltype);
    if (savemobilenumber) setMobilenumber(savemobilenumber);
  }, []);

const value: AppContextType = {
  name,
  setName,
  showlogin,
  setShowlogin,
  token,
  setToken,

  // new states
  email,
  setEmail,
  mobilenumber,
  setMobilenumber,
  state,
  setState,
  district,
  setDistrict,
  soiltype,
  setSoiltype,
  language, setLanguage, translate 
};


  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
