import OpenAI from "openai";

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

const client = new OpenAI({
  baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
  apiKey: import.meta.env.VITE_DASHSCOPE_API_KEY || "",
  dangerouslyAllowBrowser: true,
});

export async function generateRecipeFromImage(base64Image: string, mimeType: string): Promise<Recipe> {
  const response = await client.chat.completions.create({
    model: "qwen-vl-max",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: `data:${mimeType};base64,${base64Image}`,
            },
          },
          {
            type: "text",
            text: "请分析这张图片中的菜品，并生成一份详细的中文食谱。如果图片不是食物，请尽力猜测或者给出一个幽默的无法识别的提示，但仍需符合JSON格式（例如名称叫'未知黑暗料理'）。请严格按照以下JSON格式返回，不要包含任何其他内容：\n{\n  \"name\": \"菜品名称\",\n  \"description\": \"菜品的一句话描述\",\n  \"difficulty\": \"难度，如：简单、中等、困难\",\n  \"totalTime\": \"总耗时，如：30分钟\",\n  \"ingredients\": [{\"name\": \"食材名称\", \"amount\": \"用量\"}],\n  \"tools\": [\"所需工具\"],\n  \"steps\": [{\"instruction\": \"步骤说明\", \"ingredients\": [\"该步骤需要的食材\"], \"tools\": [\"该步骤需要的工具\"], \"duration\": \"耗时\"}]\n}",
          },
        ],
      },
    ],
    max_tokens: 4096,
  });

  const text = response.choices[0]?.message?.content;
  if (!text) {
    throw new Error("AI 返回内容为空");
  }

  const startIndex = text.indexOf('{');
  const endIndex = text.lastIndexOf('}');

  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    throw new Error("无法解析 AI 返回的食谱格式: " + text);
  }

  const jsonString = text.substring(startIndex, endIndex + 1);
  return JSON.parse(jsonString) as Recipe;
}
