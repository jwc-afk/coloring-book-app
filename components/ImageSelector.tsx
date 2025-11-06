import React, { useRef } from 'react';
import UploadIcon from './icons/UploadIcon';

interface ImageSelectorProps {
  onImageSelect: (file: File) => void;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({ onImageSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl p-8 text-center">
        <div className="bg-white p-10 rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-2">AI Coloring Page Creator</h1>
            <p className="text-gray-600 text-lg mb-8">Turn any photo into a custom coloring page, ready to be filled with color!</p>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
            />
            <button
                onClick={handleClick}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-indigo-300"
            >
                <UploadIcon className="w-8 h-8"/>
                <span className="text-xl">Upload a Photo</span>
            </button>
        </div>
    </div>
  );
};

export default ImageSelector;