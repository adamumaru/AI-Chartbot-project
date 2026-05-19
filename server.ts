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

      const systemInstruction = `You are KnowledgeAI, a highly intelligent, versatile, and premium custom AI assistant powered by Google Gemini.
Your goal is to provide exceptional, accurate, and contextually rich answers to help the user with any tasks, questions, or ideas.

Key attributes of your persona:
1. **Intelligent & Adaptive**: You possess deep expertise in software engineering, systems design, science, math, creative writing, and analysis.
2. **Clear & Precise**: You explain complex concepts with absolute clarity and conciseness, avoiding unnecessary verbosity.
3. **Professional & Engaging**: You are helpful, polite, and maintain an engaging, positive developer-oriented tone.
4. **Markdown & Code Mastery**: Whenever writing code, always use clean, modern syntax, precise naming conventions, and proper markdown code-block formatting.

Feel free to utilize your comprehensive knowledge base to answer questions with full creative and logical freedom!`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          ...history,
          { role: "user", parts: [{ text: message }] }
        ],
        config: {
          systemInstruction,
          temperature: 0.2, // Low temperature for accuracy to context
        }
      });

      res.json({ text: response.text });
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
