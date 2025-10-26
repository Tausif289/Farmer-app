import fetch from "node-fetch";
import { JWT } from "google-auth-library";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";

// Fix __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const analyzeCropHealth = async (req, res) => {
  try {
    let { imageBase64 } = req.body;
    if (!imageBase64) return res.status(400).json({ error: "No image provided" });

    imageBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const credentials = JSON.parse(fs.readFileSync(path.join(__dirname, "../service-account.json"), "utf8"));

    const client = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ["https://www.googleapis.com/auth/generative-language"],
    });

    const token = await client.getAccessToken();

    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`;

    const promptText = `You are an agriculture expert. Analyze this crop image and return ONLY JSON in this format:
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
}`;

    const body = {
      contents: [
        {
          role: "user",
          parts: [
            { text: promptText },
            { inlineData: { mimeType: "image/jpeg", data: imageBase64 } },
          ],
        },
      ],
      generationConfig: { maxOutputTokens: 4000 },
    };

    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();
    const candidate = result?.candidates?.[0]?.content;

    // 1️⃣ If candidate already has identification/diagnosis → return it
    if (candidate?.identification || candidate?.diagnosis) return res.json(candidate);

    // 2️⃣ Otherwise, try to parse text
    let jsonText = candidate?.parts?.[0]?.text || "";
    jsonText = jsonText.replace(/```json|```/g, "").trim();

    if (!jsonText) return res.json({ error: "Model returned empty text", raw: result });

    try {
      const parsed = JSON.parse(jsonText);
      return res.json(parsed);
    } catch {
      // 3️⃣ Fallback: model returned partial/truncated JSON → return raw for frontend
      return res.json({ warning: "Partial output", raw: result });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Crop health analysis failed" });
  }
};
