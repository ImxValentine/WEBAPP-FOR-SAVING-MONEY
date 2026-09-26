import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const base64Data = Buffer.from(bytes).toString("base64");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: file.type || "image/jpeg",
            data: base64Data,
          },
        },
        "Extract total amount, merchant name, date, and category from this receipt/slip. Return as JSON.",
      ],
    });

    return NextResponse.json({ result: response.text });
  } catch (error) {
    console.error("Scan Slip Error:", error);
    return NextResponse.json({ error: "Failed to scan slip" }, { status: 500 });
  }
}
