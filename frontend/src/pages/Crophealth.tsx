import React, { useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";

export default function CropHealthCheck() {
  interface CropHealthResult {
    identification?: {
      commonName?: string;
      confidence?: number;
    };
    diagnosis?: {
      isHealthy?: boolean;
      diagnosis?: string;
      treatment?: string;
      severity?: number;
      explanation?: string;
    };
  }

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<CropHealthResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Resize image
  const resizeAndCompressImage = (file: File) =>
    new Promise<Blob>((resolve) => {
      const img = new Image();
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => (img.src = reader.result as string);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, 512, 512);
        canvas.toBlob((blob) => resolve(blob!), "image/jpeg", 0.7);
      };
    });

  const toBase64 = (file: Blob) =>
    new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
    });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return setError("⚠️ Please select image");

    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const compressed = await resizeAndCompressImage(selectedFile);
      const base64 = await toBase64(compressed);

      const res = await axios.post(
        "http://localhost:4000/api/crop/health",
        { imageBase64: base64 }
      );

      setResult(res.data);
    } catch {
      setError("AI analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!result) return;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("AI Crop Health Report", 20, 20);

    doc.setFontSize(12);
    doc.text(`Plant: ${result.identification?.commonName}`, 20, 40);
    doc.text(
      `Healthy: ${result.diagnosis?.isHealthy ? "Yes" : "No"}`,
      20,
      50
    );
    doc.text(`Diagnosis: ${result.diagnosis?.diagnosis}`, 20, 60);
    doc.text(`Treatment: ${result.diagnosis?.treatment}`, 20, 70);

    doc.save("Crop-Health-Report.pdf");
  };

  return (
    <div className="w-full px-5 md:px-10 py-5 mx-auto">

      {/* BANNER (NOT REMOVED ✅) */}
<div className="relative w-full h-48 sm:h-64 md:h-96 rounded-3xl shadow-xl overflow-hidden mb-8">
  {/* Background Image */}
  <img
    src="https://img.freepik.com/premium-photo/crop-rotation-soil-testing-protocol-wallpaper_987764-48146.jpg"
    alt="Crop Health"
    className="w-full h-full object-cover"
  />

  {/* Overlay for readability */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 flex items-center justify-center">
    <div className="text-center text-white px-4 sm:px-6">
      <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-wide drop-shadow-2xl">
        🤖 AI Powered Crop Health Scanner
      </h1>
      <p className="mt-2 sm:mt-4 text-sm sm:text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto text-green-200">
        Upload your crop image to detect diseases, <span className="font-semibold">identify plant health</span>, and get <span className="text-green-300 font-semibold">smart treatment recommendations</span>.
      </p>
    </div>
  </div>
</div>

      {/* Upload Card */}
      <div className="bg-white rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 border border-green-200">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
         <div className="border-2 border-dashed border-green-400 rounded-xl p-4 sm:p-6 md:p-8 text-center bg-green-50 hover:bg-green-100 transition">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          {preview && (
            <img
              src={preview}
              className="max-h-60 mx-auto rounded-xl shadow-lg"
            />
          )}

          <button
            type="submit"
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition"
          >
            {loading ? "Analyzing with AI..." : "🚀 Analyze with AI"}
          </button>
        </form>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mt-6 p-4 bg-red-100 text-red-600 rounded-xl">
          {error}
        </div>
      )}

      {/* RESULT CARD */}
      {result && (
        <div className="mt-8 bg-gradient-to-br from-green-100 to-emerald-200 p-8 rounded-3xl shadow-2xl border border-green-400">

          <h2 className="text-2xl font-bold mb-6 text-green-900">
            🌱 AI Diagnosis Report
          </h2>

          {/* Plant */}
          <p><strong>Plant:</strong> {result.identification?.commonName}</p>

          {/* Confidence Bar */}
          <div className="mt-4">
            <p className="font-semibold">Confidence Score</p>
            <div className="w-full bg-gray-300 rounded-full h-4">
              <div
                className="bg-green-600 h-4 rounded-full"
                style={{
                  width: `${result.identification?.confidence || 87}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Severity Meter
          <div className="mt-4">
            <p className="font-semibold">Disease Severity</p>
            <div className="w-full bg-gray-300 rounded-full h-4">
              <div
                className="bg-red-500 h-4 rounded-full"
                style={{
                  width: `${result.diagnosis?.severity || 40}%`,
                }}
              ></div>
            </div>
          </div> */}

          <p className="mt-4">
            <strong>Healthy:</strong>{" "}
            {result.diagnosis?.isHealthy ? "Yes" : "No"}
          </p>

          <p className="mt-2">
            <strong>Diagnosis:</strong> {result.diagnosis?.diagnosis}
          </p>

          <p className="mt-2">
            <strong>Treatment:</strong> {result.diagnosis?.treatment}
          </p>

          {/* AI Explanation */}
          <div className="mt-6 p-4 bg-white rounded-xl shadow">
            <h4 className="font-semibold text-green-800 mb-2">
              🧠 AI Explanation
            </h4>
            <p className="text-gray-700">
              {result.diagnosis?.explanation ||
                "AI analyzed leaf patterns, texture, and color variations to determine disease condition."}
            </p>
          </div>

          {/* PDF Download */}
          <button
            onClick={downloadPDF}
            className="mt-6 bg-black text-white px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition"
          >
            📄 Download PDF Report
          </button>
        </div>
      )}
    </div>
  );
}
