// controller/translationController.js
import fetch from "node-fetch"; // Node < 18 के लिए, Node 18+ में optional

// ✅ Single text translation
export const translateText = async (req, res) => {
  const { text, targetLang } = req.body;

  if (!text || !targetLang) {
    return res.status(400).json({ error: "Missing text or targetLang" });
  }

  try {
    // Google Translate Unofficial API
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(
        text
      )}`
    );

    const data = await response.json();
    const translated = data[0][0][0]; // extract translation

    res.json({ translated });
  } catch (error) {
    console.error("Translation API failed:", error);
    res.status(500).json({ error: "Translation failed" });
  }
};

// ✅ Batch translation
export const translateBatch = async (req, res) => {
  const { texts, targetLang } = req.body;

  if (!texts || !Array.isArray(texts) || !targetLang) {
    return res.status(400).json({ error: "Missing texts array or targetLang" });
  }

  try {
    // Join all texts with delimiter
    const query = texts.join(" ||| ");

    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(
        query
      )}`
    );

    const data = await response.json();
    const joinedTranslation = data[0].map((chunk) => chunk[0]).join("");
    const translatedArray = joinedTranslation.split(" ||| ");

    res.json({ translated: translatedArray });
  } catch (error) {
    console.error("Batch Translation API failed:", error);
    res.status(500).json({ error: "Batch translation failed" });
  }
};
