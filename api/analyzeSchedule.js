import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Проверяем наличие текста в теле запроса
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Missing 'text' in request body" });
    }

    const result = await model.generateContent(text);
    const responseText = result.response.text();

    res.status(200).json({ result: responseText });
  } catch (err) {
    console.error("Serverless Function Error:", err);
    res.status(500).json({ error: err.message });
  }
}
