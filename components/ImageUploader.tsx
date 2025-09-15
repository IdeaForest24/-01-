
import React, { useCallback, useState } from 'react';
import { UploadIcon } from './Icon';

interface ImageUploaderProps {
  onImageUpload: (file: File, preview: string) => void;
  sourcePreview: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, sourcePreview }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback((files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          onImageUpload(file, reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  }, [onImageUpload]);

  const onDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const onDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const onDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  return (
    <label
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`relative group w-full aspect-video sm:aspect-[2/1] bg-gray-700/50 border-2 border-dashed border-gray-500 rounded-xl flex flex-col justify-center items-center cursor-pointer transition-all duration-300 ${
        isDragging ? 'border-indigo-500 bg-indigo-900/50 scale-105' : 'hover:border-gray-400'
      }`}
    >
      <input
        type="file"
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
        onChange={(e) => handleFileChange(e.target.files)}
      />
      {sourcePreview ? (
        <>
          <img src={sourcePreview} alt="Uploaded preview" className="object-contain h-full w-full rounded-xl p-1" />
           <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl">
             <UploadIcon className="w-10 h-10 text-white mb-2" />
             <p className="text-white font-semibold">다른 이미지 선택</p>
           </div>
        </>
      ) : (
        <div className="text-center text-gray-400">
          <UploadIcon className="w-12 h-12 mx-auto mb-3" />
          <p className="font-semibold text-lg">클릭하거나 이미지를 여기로 드래그하세요</p>
          <p className="text-sm">PNG, JPG, WEBP 지원</p>
        </div>
      )}
    </label>
  );
};
