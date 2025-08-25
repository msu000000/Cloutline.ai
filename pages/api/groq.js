// lib/groq.js
import Groq from "groq-sdk";

if (!process.env.GROQ_API_KEY) {
  throw new Error("Missing GROQ_API_KEY in environment variables");
}

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});
