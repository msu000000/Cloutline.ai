// pages/api/generateHook.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { topic } = req.body;

    if (!topic || typeof topic !== "string") {
      return res.status(400).json({ error: "Invalid topic" });
    }

    // Call Groq API
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-8b-8192", // You can switch to a different Groq model if needed
        messages: [
          { role: "system", content: "You are an expert at writing viral short-form hooks." },
          { role: "user", content: `Generate 5 viral short video hooks about: ${topic}` },
        ],
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(500).json({ error: `Groq API failed: ${errorText}` });
    }

    const data = await response.json();
    const hooks = data.choices?.[0]?.message?.content || "No hooks generated";

    return res.status(200).json({ hooks });
  } catch (error: any) {
    console.error("Error generating hooks:", error);
    return res.status(500).json({ error: error.message || "Something went wrong" });
  }
}
