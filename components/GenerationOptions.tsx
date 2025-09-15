import React from 'react';
import { StylePreset } from '../constants/prompts';

interface GenerationOptionsProps {
  styles: StylePreset[];
  selectedStyles: string[];
  onStyleChange: (styleId: string) => void;
  imageCount: number;
  onImageCountChange: (count: number) => void;
}

export const GenerationOptions: React.FC<GenerationOptionsProps> = ({
  styles,
  selectedStyles,
  onStyleChange,
  imageCount,
  onImageCountChange,
}) => {
  return (
    <div className="my-8 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-200 mb-3">1. 생성할 스타일 선택 (여러 개 선택 가능)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {styles.map((style) => (
            <label
              key={style.id}
              className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 text-center ${
                selectedStyles.includes(style.id)
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg'
                  : 'bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-gray-500'
              }`}
            >
              <input
                type="checkbox"
                className="hidden"
                checked={selectedStyles.includes(style.id)}
                onChange={() => onStyleChange(style.id)}
              />
              <span className="text-sm font-medium">{style.name}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="image-count" className="block text-lg font-semibold text-gray-200 mb-3">
          2. 스타일별 생성 개수
        </label>
        <div className="flex items-center max-w-[200px]">
          <input
            id="image-count"
            type="number"
            min="1"
            max="4"
            value={imageCount}
            onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val)) {
                    onImageCountChange(val);
                }
            }}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center"
          />
           <span className="ml-3 text-gray-400 whitespace-nowrap">개 (최대 4개)</span>
        </div>
      </div>
    </div>
  );
};
