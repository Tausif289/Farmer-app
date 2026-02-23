import OpenAI from "openai";
import 'dotenv/config';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const askQuestion = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || question.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Question is required",
      });
    }

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-3.5-turbo",
      messages: [
        { role: "user", content: question }
      ],
    });

    const answer = completion.choices[0].message.content;

    res.json({
      success: true,
      answer,
    });

  } catch (error) {
    console.error("OpenRouter Error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};