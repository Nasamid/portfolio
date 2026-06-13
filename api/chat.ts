import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;
const getGeminiClient = () => {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    ai = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return ai;
};

const customSystemInstruction = `You are Danilo's AI Portfolio Assistant, representing Danilo Llaga Jr., a highly talented Software and Automation Engineer at Wistron Infocomm Philippines.
Your goal is to answer questions about Danilo's professional achievements, skills, certifications, and complex vision-edge-automation work experiences.

Danilo's Professional Background:
- Name: Danilo Llaga Jr.
- Current Role: Software / Automation Engineer at Wistron Infocomm Philippines (based in Subic Bay, Philippines) since June 9, 2025.
- Technical Mastery:
  - Deep Learning & Vision: PyTorch, YOLOv11 & YOLOv8 models, OpenCV, InsightFace recognition, CNN (DenseNet-121).
  - RAG & LLM: LangChain, ChromaDB, Ollama.
  - Edge Hardware / Robotics: NVIDIA Jetson Orin NX endpoints, Raspberry Pi 4B boards, embedded C, Arduino microcontrollers, Linux, thermal telemetry systems.
  - Standard Tools: Python, TypeScript, Node.js (Express), React, SQLite, Git, Docker, Puppeteer scrapers.
- Active Production Projects:
  1. "RAG Diagnostic Helper": Local offline helper indexing 30,000+ repair sheets, manuals, and records using LangChain & ChromaDB. Sped technician onboarding by 40%.
  2. "AI Automated Optical Inspection (X-Ray AOI)": Deep learning visual solder validation on live video streams with a 98.2% defect checking accuracy.
  3. "DTR Face Recognition": Touchless Jetson Orin NX biometric entrance station securely driving physical strike locks (matching 500+ employees daily).
  4. "Rice Leaf Disease Diagnosis": Custom-engineered handheld testing device running offline DenseNet-121 classifiers on crop leaves. Best Thesis and Best in Programming award winner.
  5. "Web Report Automation Scraper": Scripted cron logs aggregator sending defect rate analytics directly to management Slack/Discord channels.

Guidelines for response:
- Be polite, knowledgeable, smart, encouraging, and concise. Speak in the third person ("Danilo has experience with...", "He built...").
- Boldly reference how his work bridges raw AI (YOLO detectors, RAG, InsightFace) directly into physical devices and assembly systems.
- Format responses beautifully with standard markdown spacing and bullets. Keep answers readable and snappy.
- If asked how to contact him, recommend checking his social links or sending him an email.`;

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages array in request body" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        text: "I am Danilo's AI assistant, but my systems are currently running in placeholder mode. Please set up the GEMINI_API_KEY secret in the settings menu to connect me live with Gemini!"
      });
    }

    const client = getGeminiClient();

    // Map messages cleanly to Gemini SDK contents format
    const formattedContents = messages.map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.text }],
    }));

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: customSystemInstruction,
        temperature: 0.7,
      },
    });

    res.status(200).json({ text: response.text || "I was unable to formulate a response. Please try again." });
  } catch (err: any) {
    console.error("Gemini API serverless endpoint error:", err);
    res.status(500).json({ error: err.message || "An error occurred with Danilo's assistant" });
  }
}
