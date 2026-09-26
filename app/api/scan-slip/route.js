import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ใช้ Gemini Flash ในการอ่านข้อมูลจากภาพสลิป
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      วิเคราะห์ภาพสลิปการโอนเงินนี้ แล้วส่งผลลัพธ์กลับมาเป็น JSON Format เท่านั้น โดยไม่มี markdown block หรือข้อความอื่น
      รูปแบบ JSON ที่ต้องการ:
      {
        "date": "YYYY-MM-DD",
        "time": "HH:mm",
        "amount": 0.00,
        "note": "ข้อความบันทึกช่วยจำในสลิป (ถ้าไม่มีให้ระบุเป็น null)"
      }
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: buffer.toString("base64"),
          mimeType: file.type,
        },
      },
    ]);

    const responseText = result.response.text().trim();
    // ทำการ Parse JSON
    const jsonStart = responseText.indexOf("{");
    const jsonEnd = responseText.lastIndexOf("}") + 1;
    const cleanJson = responseText.slice(jsonStart, jsonEnd);
    const data = JSON.parse(cleanJson);

    return Response.json({ success: true, data });
  } catch (error) {
    console.error("Error scanning slip:", error);
    return Response.json({ error: "Failed to scan slip" }, { status: 500 });
  }
}
