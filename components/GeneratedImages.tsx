
import React from 'react';
import { GeneratedImage } from '../types';

interface GeneratedImagesProps {
  images: GeneratedImage[];
}

export const GeneratedImages: React.FC<GeneratedImagesProps> = ({ images }) => {
  if (images.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-center mb-6 text-indigo-300">생성된 광고 이미지</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {images.map((image, index) => (
          <div key={index} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/30">
            <div className="aspect-w-1 aspect-h-1">
              <img src={image.src} alt={image.title} className="object-cover w-full h-full" />
            </div>
            <div className="p-4 bg-gray-700">
              <h3 className="font-semibold text-center text-gray-200">{image.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
