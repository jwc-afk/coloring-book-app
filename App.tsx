import React, { useState, useCallback, useRef } from 'react';
import ImageSelector from './components/ImageSelector';
import ColoringCanvas from './components/ColoringCanvas';
import ColorPalette from './components/ColorPalette';
import { generateColoringPage } from './services/geminiService';
import { fileToBase64, extractBase64, extractMimeType } from './utils/imageUtils';
import { COLOR_PALETTE } from './constants';
import LoadingSpinner from './components/icons/LoadingSpinner';
import RestartIcon from './components/icons/RestartIcon';
import ShareIcon from './components/icons/ShareIcon';
import ShareModal from './components/ShareModal';

type AppState = 'initial' | 'loading' | 'coloring' | 'error';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('initial');
  const [coloringPageImage, setColoringPageImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>(COLOR_PALETTE[0]);
  const [error, setError] = useState<string | null>(null);
  const [isSharingModalOpen, setIsSharingModalOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = useCallback(async (file: File) => {
    setAppState('loading');
    setError(null);
    try {
      const dataUrl = await fileToBase64(file);
      const mimeType = extractMimeType(dataUrl) || 'image/jpeg';
      const base64Data = extractBase64(dataUrl);
      
      const generatedImage = await generateColoringPage(base64Data, mimeType);
      
      if (generatedImage) {
        setColoringPageImage(generatedImage);
        setSelectedColor(COLOR_PALETTE[0]);
        setAppState('coloring');
      } else {
        throw new Error('The AI could not generate a coloring page. Please try another image.');
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      setAppState('error');
    }
  }, []);

  const handleStartOver = () => {
    setAppState('initial');
    setColoringPageImage(null);
    setSelectedColor(COLOR_PALETTE[0]);
    setError(null);
  };
  
  const handleOpenShareModal = () => setIsSharingModalOpen(true);
  const handleCloseShareModal = () => setIsSharingModalOpen(false);


  const renderContent = () => {
    switch (appState) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center text-center text-gray-600">
            <LoadingSpinner className="w-16 h-16 mb-4" />
            <h2 className="text-2xl font-bold">Drawing your coloring page...</h2>
            <p className="mt-2">The AI is hard at work. This should only take a moment!</p>
          </div>
        );
      case 'coloring':
        return (
          <div className="w-full h-full flex flex-col">
            <header className="flex-shrink-0 p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">AI Coloring Book</h1>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleOpenShareModal}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                    >
                        <ShareIcon className="w-5 h-5" />
                        Share
                    </button>
                    <button
                        onClick={handleStartOver}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                    >
                        <RestartIcon className="w-5 h-5" />
                        Start Over
                    </button>
                </div>
            </header>
            <main className="flex-grow flex flex-col overflow-hidden">
                <div className="flex-grow flex items-center justify-center p-2 md:p-4 overflow-hidden">
                    {coloringPageImage && (
                        <ColoringCanvas ref={canvasRef} imageSrc={coloringPageImage} selectedColor={selectedColor} />
                    )}
                </div>
                <div className="flex-shrink-0">
                    <ColorPalette
                        palette={COLOR_PALETTE}
                        selectedColor={selectedColor}
                        onColorSelect={setSelectedColor}
                    />
                </div>
            </main>
          </div>
        );
      case 'error':
         return (
             <div className="text-center p-4">
                <h2 className="text-2xl font-bold text-red-600">Oops! Something went wrong.</h2>
                <p className="mt-2 text-gray-600">{error}</p>
                <button onClick={handleStartOver} className="mt-6 px-6 py-2 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600 transition-colors">
                    Try Again
                </button>
            </div>
         );
      case 'initial':
      default:
        return <ImageSelector onImageSelect={handleImageUpload} />;
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-100 text-gray-800 flex flex-col items-center justify-center overflow-hidden">
      {renderContent()}
      <ShareModal 
        isOpen={isSharingModalOpen} 
        onClose={handleCloseShareModal} 
        canvasRef={canvasRef} 
      />
    </div>
  );
};

export default App;