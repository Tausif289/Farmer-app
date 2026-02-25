import fetch from "node-fetch";
import { JWT } from "google-auth-library";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const credentials = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../service-account.json"), "utf8")
);

const client = new JWT({
  email: credentials.client_email,
  key: credentials.private_key,
  scopes: ["https://www.googleapis.com/auth/generative-language"],
});

const getGeminiToken = async () => {
  const token = await client.getAccessToken();
  return token.token;
};

/* =========================================
   PARSE SOIL REPORT
========================================= */

export const parseSoilReportAI = async (req, res) => {
  try {
    let { imageBase64, textData } = req.body;

    if (!imageBase64 && !textData) {
      return res.status(400).json({
        success: false,
        message: "Soil report image or text required",
      });
    }

    if (imageBase64) {
      imageBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    }

    const token = await getGeminiToken();

    const promptText = `
You are a soil science expert.

IMPORTANT:
- Return ONLY valid JSON.
- Do NOT wrap in markdown.
- Complete the JSON fully.

Return JSON in this exact structure:

{
  "soilValues": {
    "pH": number,
    "nitrogen": number,
    "phosphorus": number,
    "potassium": number,
    "organicCarbon": number,
    "ec": number
  },
  "analysis": {
    "soilHealthScore": number,
    "fertilityLevel": "Low / Medium / High",
    "majorIssues": ["list problems"],
    "cropRecommendation": ["suitable crops"],
    "fertilizerSuggestion": "Detailed fertilizer advice"
  }
}
`;

    const parts = [{ text: promptText }];

    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: imageBase64,
        },
      });
    }

    if (textData) {
      parts.push({ text: `Soil Report Text:\n${textData}` });
    }

    const body = {
      contents: [{ role: "user", parts }],
      generationConfig: {
        maxOutputTokens: 4096,
        temperature: 0,
        responseMimeType: "application/json", // 🔥 important
      },
    };

    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error:", errorText);
      return res.status(500).json({
        success: false,
        message: "Gemini API request failed",
        error: errorText,
      });
    }

    const result = await response.json();
    const rawText =
      result?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    console.log("RAW AI RESPONSE:\n", rawText);

    if (!rawText) {
      return res.status(500).json({
        success: false,
        message: "Empty AI response",
      });
    }

    // 🔥 Safe JSON extraction
    const start = rawText.indexOf("{");
    const end = rawText.lastIndexOf("}");

    if (start === -1 || end === -1) {
      return res.status(200).json({
        success: false,
        message: "AI returned incomplete JSON",
        raw: rawText,
      });
    }

    const jsonString = rawText.substring(start, end + 1);

    try {
      const parsed = JSON.parse(jsonString);

      return res.json({
        success: true,
        data: parsed,
      });
    } catch (err) {
      console.error("JSON Parse Error:", err);
      return res.status(200).json({
        success: false,
        message: "JSON parsing failed (possibly truncated)",
        raw: rawText,
      });
    }
  } catch (err) {
    console.error("Soil Parsing Error:", err);
    return res.status(500).json({
      success: false,
      message: "Soil report parsing failed",
    });
  }
};

/* =========================================
   ANALYZE SOIL IMAGE
========================================= */
export const analyzeSoilImage = async (req, res) => {
  try {
    let { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        success: false,
        message: "No soil image provided",
      });
    }

    // Strip MIME prefix
    imageBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const token = await getGeminiToken();
    if (!token) {
      return res.status(500).json({
        success: false,
        message: "Failed to get AI token",
      });
    }

    const promptText = `
You are a soil science expert.

Return ONLY valid JSON:

{
  "soilAnalysis": {
    "soilType": "Sandy / Clay / Loamy / Black / Red / Unknown",
    "moistureLevel": "Dry / Moderate / Wet",
    "organicMatterLevel": "Low / Medium / High",
    "salinitySigns": true/false,
    "surfaceCondition": "Cracked / Normal / Compacted / Erosion visible"
  },
  "healthAssessment": {
    "overallHealth": "Poor / Average / Good",
    "confidenceScore": number,
    "recommendation": "Fertilizer and soil improvement suggestions"
  }
}
`;

    const body = {
      contents: [
        {
          role: "user",
          parts: [
            { text: promptText },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: imageBase64,
              },
            },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: 3000,
        temperature: 0,
        responseMimeType: "application/json",
      },
    };

    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Gemini API Error:", response.status, text);
      return res.status(500).json({
        success: false,
        message: `AI service error: ${response.status}`,
        raw: text,
      });
    }

    const result = await response.json();
    const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return res.status(500).json({
        success: false,
        message: "AI returned no content",
      });
    }

    // Safely parse JSON
    const start = rawText.indexOf("{");
    const end = rawText.lastIndexOf("}");
    if (start === -1 || end === -1) {
      return res.status(500).json({
        success: false,
        message: "Invalid AI response format",
        raw: rawText,
      });
    }

    let parsed;
    try {
      parsed = JSON.parse(rawText.substring(start, end + 1));
    } catch (parseErr) {
      console.error("JSON parse error:", parseErr);
      return res.status(500).json({
        success: false,
        message: "Failed to parse AI JSON",
        raw: rawText,
      });
    }

    return res.json({
      success: true,
      data: parsed,
    });
  } catch (err) {
    console.error("Soil Image Error:", err);
    return res.status(500).json({
      success: false,
      message: "Soil image analysis failed",
      error: err.message,
    });
  }
};