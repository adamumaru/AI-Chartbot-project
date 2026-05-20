import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Gemini Chat
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, context, history } = req.body;
      
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
      }

      const systemInstruction = `You are a helpful AI assistant.
${context ? `\nYou can use the following context if it is relevant to the user's query:\n${context}` : ""}
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          ...history,
          { role: "user", parts: [{ text: message }] }
        ],
        config: {
          systemInstruction,
          temperature: 0.7, // Warm and conversational
        }
      });

      let suggestedTitle = undefined;
      if (!history || history.length === 0) {
        try {
          const titleResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate a short, friendly, and creative 2-4 word title (no quotation marks, no emojis, no prefix, plain text only) summarizing this health question: "${message}"`,
            config: {
              temperature: 0.5,
              maxOutputTokens: 10,
            }
          });
          suggestedTitle = titleResponse.text.trim().replace(/^["']|["']$/g, '');
        } catch (err) {
          console.error("Failed to generate suggested title:", err);
        }
      }

      res.json({ text: response.text, title: suggestedTitle });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate response" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
