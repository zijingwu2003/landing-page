// import { GoogleGenAI, Chat } from "@google/genai";

// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// export const generateWelcomeMessage = async (isLocal: boolean, distance: number | null): Promise<string> => {
//   try {
//     let prompt = "Write a short, punchy, 1-sentence welcome message for a user joining the 'ReWear' sustainable fashion marketplace waitlist.";
    
//     if (isLocal) {
//       prompt += ` They are located just ${distance?.toFixed(1)} miles from our campus hub. Mention that they will be among the first to trade.`;
//     } else {
//       prompt += " They are a bit far from our launch hub, but mention we are expanding globally soon.";
//     }
    
//     prompt += " Tone: Trendy, eco-conscious, excited. Do not use hashtags.";

//     const response = await ai.models.generateContent({
//       model: 'gemini-2.5-flash',
//       contents: prompt,
//     });

//     return response.text || "Welcome to the circular fashion revolution!";
//   } catch (error) {
//     console.error("Gemini API Error:", error);
//     return "Thanks for joining the movement! We'll be in touch soon.";
//   }
// };

// let chatSession: Chat | null = null;

// export const getChatResponse = async (userMessage: string): Promise<string> => {
//     if (!chatSession) {
//         chatSession = ai.chats.create({
//             model: 'gemini-2.5-flash',
//             config: {
//                 systemInstruction: "You are the AI assistant for ReWear, a sustainable fashion marketplace. \n" +
//                                    "Our Mission: To transform how we consume fashion on campus through a circular economy.\n" +
//                                    "Our Vision: A world where clothes are shared, reused, and repurposed to minimize waste.\n" +
//                                    "Our Values: Sustainability, Community, Style.\n" +
//                                    "Context: We are currently in a waitlist phase. The app uses geo-targeting to connect local buyers and sellers (Launch Zone: 15 miles around Cornell Tech). \n" +
//                                    "Tone: Friendly, trendy, eco-conscious, helpful. Keep answers concise."
//             }
//         });
//     }

//     try {
//         const result = await chatSession.sendMessage({ message: userMessage });
//         return result.text || "I'm having a little trouble connecting to the fashion grid right now.";
//     } catch (e) {
//         console.error("Chat Error", e);
//         return "Oops, I dropped the thread. Can you say that again?";
//     }
// }

import { GoogleGenAI, Chat } from "@google/genai";

/**
 * API key resolution (front-end friendly)
 * - Vite/React (recommended): import.meta.env.VITE_GEMINI_API_KEY
 * - If you later move this to server-side: process.env.GEMINI_API_KEY / process.env.API_KEY
 */
function getGeminiApiKey(): string {
  // Vite injects env vars via import.meta.env (only those prefixed with VITE_)
  const viteKey = (import.meta as any)?.env?.VITE_GEMINI_API_KEY;

  // In case this file is ever used in a Node-ish runtime
  const nodeKey =
    (globalThis as any)?.process?.env?.GEMINI_API_KEY ??
    (globalThis as any)?.process?.env?.API_KEY;

  return String(viteKey ?? nodeKey ?? "").trim();
}

const API_KEY = getGeminiApiKey();

// If no key, disable Gemini and fall back to plain text.
const ai: GoogleGenAI | null = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export const isGeminiEnabled = (): boolean => Boolean(ai);

export const generateWelcomeMessage = async (
  isLocal: boolean,
  distance: number | null
): Promise<string> => {
  // No key => text-only fallback
  if (!ai) {
    return "Thanks for joining the movement! We'll be in touch soon.";
  }

  try {
    let prompt =
      "Write a short, punchy, 1-sentence welcome message for a user joining the 'ReWear' sustainable fashion marketplace waitlist.";

    if (isLocal) {
      prompt += ` They are located just ${distance?.toFixed(
        1
      )} miles from our campus hub. Mention that they will be among the first to trade.`;
    } else {
      prompt += " They are a bit far from our launch hub, but mention we are expanding globally soon.";
    }

    prompt += " Tone: Trendy, eco-conscious, excited. Do not use hashtags.";

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "Welcome to the circular fashion revolution!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Thanks for joining the movement! We'll be in touch soon.";
  }
};

let chatSession: Chat | null = null;

export const resetChatSession = (): void => {
  chatSession = null;
};

export const getChatResponse = async (userMessage: string): Promise<string> => {
  // No key => text-only fallback
  if (!ai) {
    return "AI is currently unavailable, but you can still explore ReWear normally.";
  }

  if (!chatSession) {
    chatSession = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction:
          "You are the AI assistant for ReWear, a sustainable fashion marketplace. \n" +
          "Our Mission: To transform how we consume fashion on campus through a circular economy.\n" +
          "Our Vision: A world where clothes are shared, reused, and repurposed to minimize waste.\n" +
          "Our Values: Sustainability, Community, Style.\n" +
          "Context: We are currently in a waitlist phase. The app uses geo-targeting to connect local buyers and sellers (Launch Zone: 15 miles around Cornell Tech). \n" +
          "Tone: Friendly, trendy, eco-conscious, helpful. Keep answers concise.",
      },
    });
  }

  try {
    const result = await chatSession.sendMessage({ message: userMessage });
    return result.text || "I'm having a little trouble connecting to the fashion grid right now.";
  } catch (e) {
    console.error("Chat Error", e);
    return "Oops, I dropped the thread. Can you say that again?";
  }
};
