// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Groq client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Route to generate hooks
app.post("/api/generateHook", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: `Generate a viral YouTube Shorts hook for: ${prompt}`,
        },
      ],
      max_tokens: 100,
    });

    const hook = response.choices[0]?.message?.content || "No hook generated";
    res.json({ hook });
  } catch (error) {
    console.error("Error generating hook:", error);
    res.status(500).json({ error: "Failed to generate hook" });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
