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
 * 专门针对 Vite 前端项目的配置
 * 确保你的 .env 文件里配置的是 VITE_GEMINI_API_KEY
 */
const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY as string | undefined;

// 打印日志方便调试（生产环境可以看到 Key 是否成功加载，但不会打印 Key 的具体内容）
console.log("[Gemini Service] API Key detected:", !!apiKey);

// 初始化 AI 客户端
// 如果没有 Key，ai 变量就是 null，后续函数会自动使用兜底文案
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// 导出一个辅助函数，用于前端判断 AI 是否可用
export const isGeminiEnabled = (): boolean => Boolean(ai);

/**
 * 生成欢迎语
 */
export const generateWelcomeMessage = async (
  isLocal: boolean,
  distance: number | null
): Promise<string> => {
  // 1. 如果没有配置 API Key，直接返回固定文案，防止报错
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
    // API 调用出错时的兜底文案
    return "Thanks for joining the movement! We'll be in touch soon.";
  }
};

// 聊天会话变量
let chatSession: Chat | null = null;

/**
 * 重置聊天会话（例如用户登出或重新开始时调用）
 */
export const resetChatSession = (): void => {
  chatSession = null;
};

/**
 * 获取聊天回复
 */
export const getChatResponse = async (userMessage: string): Promise<string> => {
  // 1. 如果没有 API Key，返回友好的不可用提示
  if (!ai) {
    return "AI is currently unavailable, but you can still explore ReWear normally.";
  }

  // 2. 如果会话还没开始，初始化一个新的聊天会话
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
    // 对话出错时的兜底文案
    return "Oops, I dropped the thread. Can you say that again?";
  }
};
