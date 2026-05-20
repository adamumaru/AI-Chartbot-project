import { Message } from "../types";

export const chatService = {
  async sendMessage(message: string, context: string, history: Message[]) {
    const formattedHistory = history.map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    }));

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        context,
        history: formattedHistory,
      }),
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const error = await response.json();
        throw new Error(error.error || "Failed to get AI response");
      } else {
        // Fallback for non-JSON responses (like 404 HTML pages from Vercel)
        const text = await response.text();
        throw new Error(`Server returned status ${response.status}: ${text.substring(0, 100)}...`);
      }
    }

    return await response.json();
  },
};
