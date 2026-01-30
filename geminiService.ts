
import { GoogleGenAI, Type } from "@google/genai";

/**
 * High-Precision Pharmaceutical Extraction Service.
 * Leveraging Gemini 3 Pro Preview's multimodal reasoning to outperform 
 * legacy Tesseract-only pipelines by combining visual OCR with chemical validation.
 */
export const extractMedicineDetails = async (base64Image: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
          },
        },
        {
          text: `Act as a high-intelligence clinical verification system (Expert-level multimodal reasoning).
          
          TASK: Verify this pharmaceutical packaging.
          
          STEPS:
          1. OCR Analysis: Extract raw text from the image focusing on product name, strength, and expiry date.
          2. Pharmaceutical Validation: Cross-reference identified names with standard chemical nomenclature to fix common OCR errors (e.g., 'Metformim' to 'Metformin').
          3. Decision Making: Determine if the medicine is clearly identifiable and safe for redistribution based on visible stamps.
          
          REQUIRED FIELDS:
          - name: Canonical trade or generic name.
          - expiryDate: Format strictly YYYY-MM-DD.
          - strength: mg, mcg, %, etc.
          - brand: Manufacturer name.
          - isReadable: Boolean (True if name and expiry are certain).
          - reasoning: Brief technical summary of the visual data.

          Return ONLY valid JSON.`,
        }
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          expiryDate: { type: Type.STRING, description: "YYYY-MM-DD" },
          strength: { type: Type.STRING },
          brand: { type: Type.STRING },
          isReadable: { type: Type.BOOLEAN },
          reasoning: { type: Type.STRING }
        },
        required: ["isReadable", "name", "expiryDate"]
      }
    }
  });

  const rawOutput = response.text || '{}';
  try {
    return JSON.parse(rawOutput);
  } catch (e) {
    console.error("Analysis failed:", rawOutput);
    return { isReadable: false, reasoning: "Could not parse clinical data" };
  }
};
