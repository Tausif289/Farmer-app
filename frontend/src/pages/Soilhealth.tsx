import React, { useState, useRef } from "react";
import axios from "axios";
import { UploadCloud, Loader2 } from "lucide-react";

type SoilValues = {
  ph?: number | null;
  nitrogen?: number | null;      // in mg/kg or ppm - adapt to your lab units
  phosphorus?: number | null;    // in mg/kg or ppm
  potassium?: number | null;     // optional
  calcium?: number | null;       // in mg/kg or ppm
  [key: string]: number | null | undefined;
};

type ParseResponse = {
  success: boolean;
  data?: SoilValues;
  message?: string;
};

const defaultValues: SoilValues = {
  ph: null,
  nitrogen: null,
  phosphorus: null,
  potassium: null,
  calcium: null,
};

const backendUrl = "https://backend-foarmer-app.onrender.com";


const SoilHealth: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewName, setPreviewName] = useState<string | null>(null);
  const [values, setValues] = useState<SoilValues>({ ...defaultValues });
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // Upload file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const f = e.target.files?.[0] || null;
    setFile(f);
    setPreviewName(f ? f.name : null);
  };

  // Send file to backend to parse soil report
  const analyzeReport = async () => {
    if (!file) {
      setError("Please upload a soil report file (image/pdf/csv).");
      return;
    }
    setLoading(true);
    setError(null);
    setResultMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Example endpoint: POST /api/soil/parse
      const res = await axios.post<ParseResponse>(
        `${backendUrl}/api/soil/parse`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 60000,
        }
      );

      if (res.data?.success && res.data.data) {
        setValues((prev) => ({ ...prev, ...res.data!.data! }));
        setResultMessage("Report parsed successfully. Edit values if needed.");
      } else {
        setError(res.data?.message || "Could not parse report. You can edit values manually.");
      }
    } catch (err: unknown) {
      console.error("Soil parse error:", err);
      if (err instanceof Error && err.message) setError(err.message);
      else setError("Unknown error while parsing report.");
    } finally {
      setLoading(false);
    }
  };

  // Local suggestion engine (fallback/extra)
  const generateSuggestions = (v: SoilValues) => {
    const suggestions: string[] = [];

    const ph = v.ph ?? null;
    const n = v.nitrogen ?? null;
    const p = v.phosphorus ?? null;
    const ca = v.calcium ?? null;
    const k = v.potassium ?? null;

    // pH suggestions (example thresholds — adjust based on crops)
    if (ph !== null) {
      if (ph < 5.5) suggestions.push("Soil is acidic (pH < 5.5). Apply lime (calcitic or dolomitic lime) to raise pH.");
      else if (ph >= 5.5 && ph <= 7.5) suggestions.push("Soil pH is good for most crops (5.5–7.5). Maintain with organic matter.");
      else suggestions.push("Soil is alkaline (pH > 7.5). Consider gypsum and acidifying fertilizers (use carefully).");
    } else suggestions.push("pH not available — consider testing soil pH.");

    // Nitrogen
    if (n !== null) {
      if (n < 100) suggestions.push("Nitrogen is low — apply nitrogen-rich fertilizers (e.g., urea, ammonium sulfate) or green manuring.");
      else if (n >= 100 && n <= 250) suggestions.push("Nitrogen level is moderate. Consider split N applications during crop growth.");
      else suggestions.push("Nitrogen is high — avoid excess N; monitor crop growth to prevent lodging and nutrient imbalance.");
    }

    // Phosphorus
    if (p !== null) {
      if (p < 15) suggestions.push("Phosphorus is low — apply P fertilizers like DAP or single super phosphate.");
      else if (p >= 15 && p <= 30) suggestions.push("Phosphorus is moderate — maintain with balanced fertilization.");
      else suggestions.push("Phosphorus is high — excess P can fix micronutrients; avoid adding more P.");
    }

    // Calcium
    if (ca !== null) {
      if (ca < 500) suggestions.push("Calcium is low — consider gypsum or lime depending on pH and crop requirement.");
      else suggestions.push("Calcium adequate — good for cell wall strength and yield quality.");
    }

    // Potassium
    if (k !== null) {
      if (k < 150) suggestions.push("Potassium is low — apply potash (MOP) as per crop requirement.");
      else suggestions.push("Potassium adequate — maintain with balanced fertilizer.");
    }

    // Generic advices
    suggestions.push("Add organic matter (compost or farmyard manure) to improve soil structure and nutrient holding.");
    suggestions.push("Rotate crops and include legumes to naturally replenish nitrogen.");
    suggestions.push("Avoid over-irrigation; check drainage to prevent nutrient leaching.");

    return suggestions;
  };

  // When user edits values manually
  const handleValueChange = (key: string, raw: string) => {
    const parsed = raw === "" ? null : Number(raw);
    setValues((prev) => ({ ...prev, [key]: Number.isNaN(parsed as unknown) ? null : parsed }));
  };

  // Submit final values to backend to save recommendations / farm profile
  const saveReport = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${backendUrl}/api/soil/save`,
        { values },
        { headers: { "Content-Type": "application/json" } }
      );
      if (res.data?.success) {
        setResultMessage("Soil report saved successfully.");
      } else {
        setError(res.data?.message || "Save failed.");
      }
    } catch (err: unknown) {
      console.error("Save error:", err);
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setLoading(false);
    }
  };

  const suggestions = generateSuggestions(values);

return (
  <div className="p-6 max-w-5xl mx-auto space-y-8">
    {/* Header with image */}
    <div className="relative w-full h-72 md:h-96 rounded-3xl shadow-xl overflow-hidden">
  {/* Background Image */}
  <img
    src="https://www.usbiopower.com/hs-fs/hubfs/Blog%20Art/AOE-Blog-Organic-Soil.jpg?width=3200&name=AOE-Blog-Organic-Soil.jpg"
    alt="Soil Health"
    className="w-full h-full object-cover"
  />

  {/* Overlay (dark gradient for readability) */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 flex items-center justify-center">
    <div className="text-center text-white px-6">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-wide drop-shadow-2xl">
        🌿 Soil Health Report
      </h1>
      <p className="mt-4 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto text-gray-200">
        Upload your soil report to analyze <span className="font-semibold">pH, Nitrogen, Phosphorus, Potassium</span>  
        and get personalized <span className="text-green-300 font-semibold">crop recommendations</span>.
      </p>
    </div>
  </div>
</div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Upload Panel */}
      <div className="bg-white rounded-2xl shadow-lg border p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Upload Soil Report</h2>
        <p className="text-sm text-gray-600">
          Upload lab result image / PDF / CSV. We’ll parse key values (pH, N, P, Ca, K).
        </p>

        <input
          ref={fileRef}
          type="file"
          accept=".jpg,.png,.jpeg,.pdf,.csv"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer 
                     bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <div className="flex items-center space-x-3">
          <button
            onClick={analyzeReport}
            disabled={loading}
            className="inline-flex items-center px-5 py-2.5 bg-green-600 text-white rounded-lg 
                       hover:bg-green-500 disabled:opacity-60 transition-all shadow-sm"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 w-4 h-4" />
                Analyzing...
              </>
            ) : (
              <>
                <UploadCloud className="mr-2 w-4 h-4" />
                Analyze Report
              </>
            )}
          </button>

          <button
            onClick={() => {
              setFile(null);
              setPreviewName(null);
              if (fileRef.current) fileRef.current.value = "";
              setValues({ ...defaultValues });
              setResultMessage(null);
              setError(null);
            }}
            className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
          >
            Reset
          </button>
        </div>

        {previewName && (
          <div className="text-sm text-gray-700">
            <span className="font-medium">Selected file:</span> {previewName}
          </div>
        )}

        {error && <div className="text-sm text-red-600">{error}</div>}
        {resultMessage && <div className="text-sm text-green-700">{resultMessage}</div>}
      </div>

      {/* Values & Suggestions */}
      <div className="bg-white rounded-2xl shadow-lg border p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Parsed Values (editable)</h2>

        <div className="grid grid-cols-2 gap-4">
          {[
            { key: "ph", label: "pH", step: "0.1" },
            { key: "nitrogen", label: "Nitrogen (ppm)" },
            { key: "phosphorus", label: "Phosphorus (ppm)" },
            { key: "calcium", label: "Calcium (ppm)" },
            { key: "potassium", label: "Potassium (ppm)" },
          ].map(({ key, label, step }) => (
            <label key={key} className="text-sm text-gray-700">
              {label}
              <input
                type="number"
                step={step || "1"}
                value={values[key] ?? ""}
                onChange={(e) => handleValueChange(key, e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 
                           text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </label>
          ))}
        </div>

        {/* Styled Recommendations */}
        <div className="mt-6">
          <h3 className="font-semibold text-gray-800">Recommendations</h3>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-3">
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              {suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4 flex space-x-3">
            <button
              onClick={saveReport}
              disabled={loading}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 
                         disabled:opacity-60 transition-all shadow-sm"
            >
              Save Report
            </button>

            <button
              onClick={() => navigator.clipboard?.writeText(suggestions.join("\n"))}
              className="px-5 py-2.5 border rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
            >
              Copy Suggestions
            </button>
          </div>

          <p className="mt-3 text-xs text-gray-500 leading-relaxed">
            <span className="font-medium">Note:</span> suggestions are generated using simple agronomic rules. 
            For crop-specific dosing, consult extension services or adjust rules per local recommendations.
          </p>
        </div>
      </div>
    </div>
  </div>
);
};

export default SoilHealth;
