import React, { useState, useRef } from "react";
import axios from "axios";
import { UploadCloud, Loader2, Camera } from "lucide-react";

interface SoilValues {
  ph?: number | null;
  nitrogen?: number | null;
  phosphorus?: number | null;
  potassium?: number | null;
  calcium?: number | null;
  organicCarbon?: number | null;
  ec?: number | null;
}

interface Analysis {
  soilHealthScore?: number | null; // <--- allow null
  fertilityLevel?: string | null;
  fertilizerSuggestion?: string | null;
  majorIssues?: string[];
  cropRecommendation?: string[];
}

interface AIResponse {
  success: boolean;
  data: {                // remove ? here so TS knows data exists
    soilValues?: Record<string, unknown>;
    analysis?: Record<string, unknown>;
  };
  message?: string;
}

interface SoilAnalysis {
  soilType?: string | null;
  moistureLevel?: string | null;
  organicMatterLevel?: string | null;
  salinitySigns?: boolean | null;
  surfaceCondition?: string | null;
}

interface HealthAssessment {
  overallHealth?: string | null;
  confidenceScore?: number | null;
  recommendation?: string | null;
}

interface AIImageResponse {
  success: boolean;
  data: {
    soilAnalysis?: SoilAnalysis;
    healthAssessment?: HealthAssessment;
  };
  message?: string;
}

const backendUrl = "https://backend-foarmer-app.onrender.com";

const SoilHealth: React.FC = () => {
  /* ===============================
     📄 SOIL REPORT STATES
  =================================*/
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [reportValues, setReportValues] = useState<SoilValues | null>(null);
  const [reportAnalysis, setReportAnalysis] = useState<Analysis | null>(null);
  const [reportLoading, setReportLoading] = useState(false);

  /* ===============================
     📸 SOIL IMAGE STATES
  =================================*/
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageValues, setImageValues] = useState<SoilAnalysis | null>(null);
const [imageAnalysis, setImageAnalysis] = useState<HealthAssessment | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const reportRef = useRef<HTMLInputElement | null>(null);
  const imageRef = useRef<HTMLInputElement | null>(null);

  /* ===================================================
     🔹 UTILITY FUNCTIONS TO NORMALIZE AI RESPONSE
  ===================================================*/
  // Normalizes raw API soil values into typed SoilValues
  const normalizeSoilValues = (values: Partial<Record<string, unknown>> = {}): SoilValues => ({
    ph: typeof values.pH === "number" ? values.pH : null,
    nitrogen: typeof values.nitrogen === "number" ? values.nitrogen : null,
    phosphorus: typeof values.phosphorus === "number" ? values.phosphorus : null,
    potassium: typeof values.potassium === "number" ? values.potassium : null,
    calcium: typeof values.calcium === "number" ? values.calcium : null,
    organicCarbon: typeof values.organicCarbon === "number" ? values.organicCarbon : null,
    ec: typeof values.ec === "number" ? values.ec : null,
  });

  // Normalizes raw API analysis into typed Analysis
  const normalizeAnalysis = (analysis: Partial<Record<string, unknown>> = {}): Analysis => ({
    soilHealthScore: typeof analysis.soilHealthScore === "number" ? analysis.soilHealthScore : null,
    fertilityLevel: typeof analysis.fertilityLevel === "string" ? analysis.fertilityLevel : undefined,
    fertilizerSuggestion: typeof analysis.fertilizerSuggestion === "string" ? analysis.fertilizerSuggestion : undefined,
    majorIssues: Array.isArray(analysis.majorIssues) ? (analysis.majorIssues as string[]) : [],
    cropRecommendation: Array.isArray(analysis.cropRecommendation)
      ? (analysis.cropRecommendation as string[])
      : [],
  });


  const normalizeSoilAnalysis = (data: Partial<SoilAnalysis> = {}): SoilAnalysis => ({
  soilType: typeof data.soilType === "string" ? data.soilType : null,
  moistureLevel: typeof data.moistureLevel === "string" ? data.moistureLevel : null,
  organicMatterLevel: typeof data.organicMatterLevel === "string" ? data.organicMatterLevel : null,
  salinitySigns: typeof data.salinitySigns === "boolean" ? data.salinitySigns : null,
  surfaceCondition: typeof data.surfaceCondition === "string" ? data.surfaceCondition : null,
});

const normalizeHealthAssessment = (data: Partial<HealthAssessment> = {}): HealthAssessment => ({
  overallHealth: typeof data.overallHealth === "string" ? data.overallHealth : null,
  confidenceScore: typeof data.confidenceScore === "number" ? data.confidenceScore : null,
  recommendation: typeof data.recommendation === "string" ? data.recommendation : null,
});

  /* ===================================================
     📄 PARSE SOIL REPORT
  ===================================================*/
  const analyzeReport = async (): Promise<void> => {
    if (!reportFile) {
      setError("Upload soil report first");
      return;
    }

    try {
      setReportLoading(true);
      setError(null);

      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const res = await axios.post<AIResponse>(`${backendUrl}/api/soil/parse`, { imageBase64: base64 });

        if (res.data.success && res.data.data) {
          setReportValues(normalizeSoilValues(res.data.data.soilValues));
          setReportAnalysis(normalizeAnalysis(res.data.data.analysis));
        } else {
          setError(res.data.message ?? "Report AI parsing failed");
        }

        setReportLoading(false);
      };

      reader.readAsDataURL(reportFile);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Server error");
      setReportLoading(false);
    }
  };

  /* ===================================================
     📸 ANALYZE SOIL IMAGE
  ===================================================*/
  const analyzeImage = async (): Promise<void> => {
  if (!imageFile) {
    setError("Upload soil image first");
    return;
  }

  try {
    setImageLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;

      const res = await axios.post<AIImageResponse>(
        `${backendUrl}/api/soil/analyze-image`,
        { imageBase64: base64 }
      );

      if (res.data.success && res.data.data) {
        const { soilAnalysis = {}, healthAssessment = {} } = res.data.data;

        setImageValues(normalizeSoilAnalysis(soilAnalysis));
        setImageAnalysis(normalizeHealthAssessment(healthAssessment));
      } else {
        setError(res.data.message ?? "Image AI analysis failed");
      }

      setImageLoading(false);
    };

    reader.readAsDataURL(imageFile);
  } catch (err: unknown) {
    setError(err instanceof Error ? err.message : "Server error");
    setImageLoading(false);
  }
};
  /* ===================================================
     🔹 RENDER
  ===================================================*/
  const renderSoilValues = (values: SoilValues) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-green-50 p-4 rounded-lg">
      {Object.entries(values).map(([key, val]) => (
        <div key={key} className="bg-white p-3 rounded shadow text-center">
          <p className="font-semibold text-gray-700">{key}</p>
          <p className="text-green-700">{val ?? "N/A"}</p>
        </div>
      ))}
    </div>
  );

  const renderAnalysis = (analysis: Analysis) => (
    <div className="bg-green-100 p-4 rounded-lg space-y-2">
      {analysis && analysis.fertilityLevel && (
        <p>🌱 Fertility Level: {analysis.fertilityLevel}</p>
      )}

      {analysis && analysis.fertilizerSuggestion && (
        <p>💡 Fertilizer Suggestion: {analysis.fertilizerSuggestion}</p>
      )}

      {analysis && analysis.majorIssues && analysis.majorIssues.length > 0 && (
        <div>
          <p>⚠️ Major Issues:</p>
          <ul className="list-disc list-inside">
            {analysis.majorIssues.map((issue, idx) => (
              <li key={idx}>{issue}</li>
            ))}
          </ul>
        </div>
      )}

      {analysis && analysis.cropRecommendation && analysis.cropRecommendation.length > 0 && (
        <div>
          <p>🥕 Crop Recommendations:</p>
          <ul className="list-disc list-inside">
            {analysis.cropRecommendation.map((crop, idx) => (
              <li key={idx}>{crop}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
  const renderSoilImageAnalysis = (soil: SoilAnalysis, health: HealthAssessment) => (
  <div className="bg-blue-50 p-4 rounded-lg space-y-2">
    <h3 className="font-semibold text-blue-700">🌱 Soil Analysis</h3>
    <ul className="list-disc list-inside">
      <li>Soil Type: {soil.soilType ?? "N/A"}</li>
      <li>Moisture Level: {soil.moistureLevel ?? "N/A"}</li>
      <li>Organic Matter Level: {soil.organicMatterLevel ?? "N/A"}</li>
      <li>Salinity Signs: {soil.salinitySigns != null ? (soil.salinitySigns ? "Yes" : "No") : "N/A"}</li>
      <li>Surface Condition: {soil.surfaceCondition ?? "N/A"}</li>
    </ul>

    <h3 className="font-semibold text-green-700 mt-3">💚 Health Assessment</h3>
    <ul className="list-disc list-inside">
      <li>Overall Health: {health.overallHealth ?? "N/A"}</li>
      <li>Confidence Score: {health.confidenceScore ?? "N/A"}</li>
      <li>Recommendation: {health.recommendation ?? "N/A"}</li>
    </ul>
  </div>
);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-10">
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
      {/* 📄 SOIL REPORT SECTION */}
      <div className="bg-white p-6 rounded-2xl shadow-lg space-y-4">
        <h2 className="text-2xl font-bold text-green-700">📄 Soil Report AI Analyzer</h2>

        <input
          ref={reportRef}
          type="file"
          accept=".jpg,.png,.jpeg,.pdf,.csv"
          onChange={(e) => setReportFile(e.target.files?.[0] ?? null)}
          className="w-full border rounded-lg p-2"
        />

        <button
          onClick={analyzeReport}
          disabled={reportLoading}
          className="bg-green-600 text-white px-5 py-2 rounded-lg flex items-center gap-2"
        >
          {reportLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <UploadCloud className="w-4 h-4" />}
          Parse Report (AI)
        </button>

        {reportValues && renderSoilValues(reportValues)}
        {reportAnalysis && renderAnalysis(reportAnalysis)}
      </div>

      {/* 📸 SOIL IMAGE SECTION */}
      <div className="bg-white p-6 rounded-2xl shadow-lg space-y-4">
        <h2 className="text-2xl font-bold text-blue-700">📸 Soil Image AI Analyzer</h2>

        <input
          ref={imageRef}
          type="file"
          accept=".jpg,.png,.jpeg"
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          className="w-full border rounded-lg p-2"
        />

        <button
          onClick={analyzeImage}
          disabled={imageLoading}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg flex items-center gap-2"
        >
          {imageLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <Camera className="w-4 h-4" />}
          Analyze Soil Image
        </button>

       {imageValues && imageAnalysis && renderSoilImageAnalysis(imageValues, imageAnalysis)}
      </div>

      {error && <div className="text-red-600 font-medium text-center">{error}</div>}
    </div>
  );
};

export default SoilHealth;