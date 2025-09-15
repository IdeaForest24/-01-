import { GoogleGenAI, Modality, Part } from "@google/genai";
import { GeneratedImage } from '../types';
import { STYLE_PRESETS } from "../constants/prompts";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash-image-preview';

const fileToGenerativePart = (base64Data: string, mimeType: string): Part => {
    return {
        inlineData: {
            data: base64Data.split(',')[1],
            mimeType,
        },
    };
};

const generateImageWithPrompt = async (
    imagePart: Part,
    prompt: string,
    title: string
): Promise<GeneratedImage | null> => {
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: {
                parts: [
                    imagePart,
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                const imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
                return { src: imageUrl, title };
            }
        }
        return null; // Return null if no image is found in the response
    } catch (error) {
        console.error(`Error generating image for prompt "${prompt}":`, error);
        throw new Error(`'${title}' 스타일 이미지 생성에 실패했습니다.`);
    }
};


export const generateAdImages = async (
    base64Image: string,
    mimeType: string,
    selectedStyleIds: string[],
    imageCount: number
): Promise<GeneratedImage[]> => {
    const imagePart = fileToGenerativePart(base64Image, mimeType);

    const promptsToRun: { prompt: string; title: string }[] = [];
    const selectedStyles = STYLE_PRESETS.filter(style => selectedStyleIds.includes(style.id));

    selectedStyles.forEach(style => {
      for (let i = 0; i < imageCount; i++) {
        const title = imageCount > 1 ? `${style.name} #${i + 1}` : style.name;
        promptsToRun.push({ prompt: style.prompt, title });
      }
    });

    if (promptsToRun.length === 0) {
        return [];
    }

    // Limit total generations to prevent long waits or excessive API calls.
    if (promptsToRun.length > 10) {
        throw new Error("한 번에 최대 10개의 이미지만 생성할 수 있습니다.");
    }

    const imagePromises = promptsToRun.map(({ prompt, title }) =>
        generateImageWithPrompt(imagePart, prompt, title)
    );

    const results = await Promise.all(imagePromises);

    // Filter out any null results from failed generations
    const validResults = results.filter((result): result is GeneratedImage => result !== null);

    if (validResults.length === 0 && promptsToRun.length > 0) {
        throw new Error("모든 이미지 생성에 실패했습니다. API 키 또는 네트워크 연결을 확인해주세요.");
    }

    return validResults;
};
