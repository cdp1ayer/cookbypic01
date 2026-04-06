import { GoogleGenAI, Type } from "@google/genai";

export interface Recipe {
  name: string;
  description: string;
  difficulty: string;
  totalTime: string;
  ingredients: { name: string; amount: string }[];
  tools: string[];
  steps: {
    instruction: string;
    ingredients: string[];
    tools: string[];
    duration: string;
  }[];
}

export async function generateRecipeFromImage(base64Image: string, mimeType: string): Promise<Recipe> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image,
            mimeType: mimeType,
          },
        },
        {
          text: "请分析这张图片中的菜品，并生成一份详细的中文食谱。如果图片不是食物，请尽力猜测或者给出一个幽默的无法识别的提示，但仍需符合JSON格式（例如名称叫'未知黑暗料理'）。",
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "菜品名称" },
          description: { type: Type.STRING, description: "菜品的一句话描述" },
          difficulty: { type: Type.STRING, description: "难度，如：简单、中等、困难" },
          totalTime: { type: Type.STRING, description: "总耗时，如：30分钟" },
          ingredients: {
            type: Type.ARRAY,
            description: "食材清单",
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "食材名称" },
                amount: { type: Type.STRING, description: "用量" },
              },
              required: ["name", "amount"]
            },
          },
          tools: {
            type: Type.ARRAY,
            description: "所需烹饪工具",
            items: { type: Type.STRING },
          },
          steps: {
            type: Type.ARRAY,
            description: "烹饪步骤",
            items: {
              type: Type.OBJECT,
              properties: {
                instruction: { type: Type.STRING, description: "步骤说明" },
                ingredients: {
                  type: Type.ARRAY,
                  description: "该步骤需要的食材",
                  items: { type: Type.STRING },
                },
                tools: {
                  type: Type.ARRAY,
                  description: "该步骤需要的工具",
                  items: { type: Type.STRING },
                },
                duration: { type: Type.STRING, description: "该步骤耗时，如：5分钟" },
              },
              required: ["instruction", "ingredients", "tools", "duration"]
            },
          },
        },
        required: ["name", "description", "difficulty", "totalTime", "ingredients", "tools", "steps"]
      },
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("AI 返回内容为空");
  }

  const startIndex = text.indexOf('{');
  const endIndex = text.lastIndexOf('}');
  
  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    throw new Error("无法解析 AI 返回的食谱格式");
  }

  const jsonString = text.substring(startIndex, endIndex + 1);
  return JSON.parse(jsonString) as Recipe;
}
