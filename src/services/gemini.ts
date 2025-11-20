import { GoogleGenerativeAI, type GenerateContentRequest } from '@google/generative-ai';

const MODEL_NAME = 'gemini-2.0-flash';

const getApiKey = () => {
  const key = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  if (!key) {
    throw new Error('Gemini API key missing. Set VITE_GEMINI_API_KEY in your environment.');
  }
  return key;
};

const getModel = () => {
  const client = new GoogleGenerativeAI(getApiKey());
  return client.getGenerativeModel({ model: MODEL_NAME });
};

export const isGeminiConfigured = (): boolean => Boolean(import.meta.env.VITE_GEMINI_API_KEY);

export interface GeminiTextRequest {
  prompt: string;
  systemInstruction?: string;
  temperature?: number;
  maxOutputTokens?: number;
}

export interface GeminiTextResponse {
  text: string;
}

/**
 * Generate text with Gemini 2.0 Flash.
 */
export const generateGeminiText = async (options: GeminiTextRequest): Promise<GeminiTextResponse> => {
  const model = getModel();

  const request: GenerateContentRequest = {
    contents: [
      {
        role: 'user',
        parts: [{ text: options.prompt }],
      },
    ],
    generationConfig: {
      temperature: options.temperature ?? 0.6,
      maxOutputTokens: options.maxOutputTokens ?? 512,
    },
  };

  if (options.systemInstruction) {
    request.systemInstruction = { role: 'system', parts: [{ text: options.systemInstruction }] };
  }

  const result = await model.generateContent(request);
  const text = result.response?.text() ?? '';

  if (!text) {
    throw new Error('Gemini returned an empty response');
  }

  return { text };
};
