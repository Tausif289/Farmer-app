import React, { useState } from "react";
import axios from "axios";

export default function CropHealthCheck() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Resize & compress image
  const resizeAndCompressImage = (file: File, maxWidth = 512, maxHeight = 512) =>
    new Promise<Blob>((resolve) => {
      const img = new Image();
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => (img.src = reader.result as string);
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => resolve(blob!), "image/jpeg", 0.7);
      };
    });

  const toBase64 = (file: Blob) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
    });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else setPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) return setError("⚠️ Please select an image first!");

    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const compressedBlob = await resizeAndCompressImage(selectedFile);
      const base64 = await toBase64(compressedBlob);

      const res = await axios.post("https://farmer-app-backend-ocin.onrender.com/api/crop/health", {
        imageBase64: base64,
      });

      const data = res.data;

      if (data.identification && data.diagnosis) {
        setResult(data);
      } else if (data.raw?.identification && data.raw?.diagnosis) {
        setResult(data.raw);
      } else {
        setError("Failed to analyze crop health");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to analyze crop health");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-5 md:px-10 py-5 mx-auto">

     {/* Header with background image and overlay text */}
{/* Header with image */}
<div className="relative w-full h-72 md:h-96 rounded-3xl shadow-xl overflow-hidden mb-6">
  {/* Background Image */}
  <img
    src="https://img.freepik.com/premium-photo/crop-rotation-soil-testing-protocol-wallpaper_987764-48146.jpg"
    alt="Crop Health"
    className="w-full h-full object-cover"
  />

  {/* Overlay (dark gradient for readability) */}
  <div className="absolute inset-0  from-black/60 via-black/40 to-black/60 flex items-center justify-center">
    <div className="text-center text-white px-6">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-wide drop-shadow-2xl">
        🌿 Crop Health Checker
      </h1>
      <p className="mt-4 text-lg md:text-xl font-bold leading-relaxed max-w-2xl mx-auto text-gray-200">
        Upload an image of your crop to analyze <span className="font-semibold">plant type, disease status,</span>  
        and receive <span className="text-green-300 font-semibold">treatment suggestions</span>.
      </p>
    </div>
  </div>
</div>

{/* Form Container */}
<div className="w-full  mx-auto bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
  <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
    {/* File Input + Button in same row for md+ */}
    <div className="flex flex-col md:flex-row items-center gap-4">
      {/* File Upload */}
      <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-green-400 rounded-lg p-6 bg-green-50 hover:bg-green-100 cursor-pointer transition w-full">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="fileInput"
        />
        <label
          htmlFor="fileInput"
          className="text-green-700 font-medium cursor-pointer"
        >
          📂 Click to upload image
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full md:w-48 py-3 px-6 bg-green-600 text-white font-semibold rounded-xl shadow-md hover:bg-green-700 transition disabled:opacity-50"
      >
        {loading ? "🔎 Analyzing..." : "🌱 Analyze"}
      </button>
    </div>

    {/* Image Preview */}
    {preview && (
      <div className="flex justify-center">
        <img
          src={preview}
          alt="Preview"
          className="max-h-56 w-auto rounded-xl border border-gray-300 shadow-md"
        />
      </div>
    )}
  </form>
</div>

      {error && (
        <div className="mt-4 p-3 rounded border border-red-300 bg-red-100 text-red-700">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-5 p-6 rounded-xl border-2 border-green-800 bg-green-100 shadow-md font-sans">
          <h3 className="text-green-900 text-xl mb-4 font-semibold flex items-center gap-2">
            🌱 Crop Health Result
          </h3>
          <div className="flex flex-col gap-3">
            <p>
              <span className="font-semibold">Plant:</span>{" "}
              <span className="text-green-800">{result.identification?.commonName}</span>
            </p>
            <p>
              <span className="font-semibold">Healthy:</span>{" "}
              <span className={result.diagnosis?.isHealthy ? "text-green-700" : "text-red-600"}>
                {result.diagnosis?.isHealthy ? "Yes" : "No"}
              </span>
            </p>
            <p>
              <span className="font-semibold">Diagnosis:</span>{" "}
              <span className="text-green-800">{result.diagnosis?.diagnosis}</span>
            </p>
            <p>
              <span className="font-semibold">Treatment:</span>{" "}
              <span className="text-green-700">{result.diagnosis?.treatment}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
