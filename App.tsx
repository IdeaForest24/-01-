import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { GeneratedImages } from './components/GeneratedImages';
import { Spinner } from './components/Spinner';
import { GenerationOptions } from './components/GenerationOptions';
import { generateAdImages } from './services/geminiService';
import { GeneratedImage } from './types';
import { STYLE_PRESETS } from './constants/prompts';


function App() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourcePreview, setSourcePreview] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['minimalist', 'lifestyle']);
  const [imageCount, setImageCount] = useState<number>(1);

  const handleImageUpload = (file: File, preview: string) => {
    setSourceFile(file);
    setSourcePreview(preview);
    setGeneratedImages([]);
    setError(null);
  };

  const handleStyleChange = (styleId: string) => {
    setSelectedStyles(prev =>
      prev.includes(styleId)
        ? prev.filter(id => id !== styleId)
        : [...prev, styleId]
    );
  };

  const handleImageCountChange = (count: number) => {
    if (count >= 1 && count <= 4) {
      setImageCount(count);
    }
  };

  const handleGenerateClick = useCallback(async () => {
    if (!sourceFile || !sourcePreview) {
      setError('먼저 이미지를 업로드해주세요.');
      return;
    }
    if (selectedStyles.length === 0) {
      setError('하나 이상의 스타일을 선택해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);

    try {
      const results = await generateAdImages(sourcePreview, sourceFile.type, selectedStyles, imageCount);
      setGeneratedImages(results);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '이미지 생성 중 알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [sourceFile, sourcePreview, selectedStyles, imageCount]);

  const CTAButton: React.FC = () => (
     <button
        onClick={handleGenerateClick}
        disabled={!sourceFile || isLoading || selectedStyles.length === 0}
        className="w-full sm:w-auto mt-6 px-8 py-4 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
      >
        {isLoading ? '생성 중...' : '광고 이미지 생성 ✨'}
      </button>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-gray-800/50 rounded-2xl shadow-2xl p-6 sm:p-10 backdrop-blur-sm border border-gray-700">
          <p className="text-center text-gray-300 mb-6 text-lg">
            제품 이미지를 업로드하고 Gemini Nano Banana API를 사용하여 전문가 수준의 광고용 이미지를 즉시 생성해보세요.
          </p>
          <ImageUploader onImageUpload={handleImageUpload} sourcePreview={sourcePreview} />

          {sourceFile && (
            <GenerationOptions
              styles={STYLE_PRESETS}
              selectedStyles={selectedStyles}
              onStyleChange={handleStyleChange}
              imageCount={imageCount}
              onImageCountChange={handleImageCountChange}
            />
          )}
          
          <div className="text-center">
            <CTAButton />
          </div>
          
          {error && <div className="mt-6 text-center text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</div>}

          {isLoading && (
            <div className="mt-10 text-center">
              <Spinner />
              <p className="mt-4 text-lg text-indigo-300 animate-pulse">AI가 창의력을 발휘하는 중입니다... 잠시만 기다려주세요.</p>
            </div>
          )}

          <GeneratedImages images={generatedImages} />
        </div>
      </main>
      <footer className="text-center py-6 text-gray-500">
        <p>Powered by Google Gemini</p>
      </footer>
    </div>
  );
}

export default App;