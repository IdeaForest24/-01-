
import { GoogleGenAI, Modality, Part } from "@google/genai";
import { GeneratedImage } from '../types';

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
    mimeType: string
): Promise<GeneratedImage[]> => {
    const imagePart = fileToGenerativePart(base64Image, mimeType);

    const prompts = [
        {
            prompt: "이 제품을 사용하여 전문적인 광고 이미지를 만들어 주세요. 제품이 돋보이도록 깨끗하고 미니멀한 스튜디오 배경을 추가해주세요.",
            title: "미니멀리스트 스튜디오 샷",
        },
        {
            prompt: "이 제품을 사용하여 역동적이고 눈길을 끄는 광고 이미지를 만들어 주세요. 활기찬 색상과 추상적인 요소가 있는 라이프스타일 배경에 제품을 배치해주세요.",
            title: "역동적인 라이프스타일 샷",
        },
    ];

    const imagePromises = prompts.map(({ prompt, title }) => 
        generateImageWithPrompt(imagePart, prompt, title)
    );

    const results = await Promise.all(imagePromises);
    
    // Filter out any null results from failed generations
    const validResults = results.filter((result): result is GeneratedImage => result !== null);

    if (validResults.length === 0) {
        throw new Error("모든 이미지 생성에 실패했습니다. API 키 또는 네트워크 연결을 확인해주세요.");
    }

    return validResults;
};
