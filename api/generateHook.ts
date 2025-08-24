import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    // Call Groq API securely
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`, // from Vercel env
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: "You are an AI that generates viral YouTube/Instagram hooks." },
          { role: "user", content: `Generate 5 short, viral hooks about: ${topic}` },
        ],
      }),
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "No hooks generated.";

    return res.status(200).json({ hooks: text });

  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
