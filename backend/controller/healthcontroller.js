import fetch from "node-fetch";
import { GoogleAuth } from "google-auth-library";
import path from "path";

export const analyzeCropHealth = async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) return res.status(400).json({ error: "No image provided" });

    // Authenticate with Google Gemini
    const auth = new GoogleAuth({
      credentials: require(path.join(__dirname, "../service-account.json")),
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });
    const client = await auth.getClient();
    const token = await client.getAccessToken();

    const GEMINI_URL =
      "https://generativelanguage.googleapis.com/v1beta2/models/gemini-1.5:generateMessage";

    const prompt = `
      You are an agriculture expert. Analyze this crop image and return a JSON:
      {
        "identification": {
          "isPlant": true/false,
          "commonName": "disease or Healthy",
          "latinName": "if known else N/A"
        },
        "diagnosis": {
          "isHealthy": true/false,
          "diagnosis": "Name of disease or Healthy",
          "treatment": "Specific treatment suggestion"
        }
      }
      Image Base64: ${imageBase64}
    `;

    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, maxOutputTokens: 512 }),
    });

    const resultText = await response.text();
    let result;
    try {
      result = JSON.parse(resultText);
    } catch {
      result = { error: "Failed to parse Gemini response", raw: resultText };
    }

    res.json(result);
  } catch (err) {
    console.error("❌ analyzeCropHealth error:", err);
    res.status(500).json({ error: "Crop health analysis failed" });
  }
};
