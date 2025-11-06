import React, { useState, useEffect } from 'react';
import { dataUrlToBlob } from '../utils/imageUtils';
import DownloadIcon from './icons/DownloadIcon';
import ShareIcon from './icons/ShareIcon';
import CloseIcon from './icons/CloseIcon';
import LoadingSpinner from './icons/LoadingSpinner';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, canvasRef }) => {
  const [caption, setCaption] = useState('');
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      setImageDataUrl(dataUrl);
      setShareError(null);
    }
  }, [isOpen, canvasRef]);

  if (!isOpen) {
    return null;
  }

  const handleSaveImage = () => {
    if (!imageDataUrl) return;
    const link = document.createElement('a');
    link.href = imageDataUrl;
    link.download = 'my-coloring-masterpiece.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (!imageDataUrl || !navigator.share) {
        setShareError("Your browser doesn't support the Web Share API.");
        return;
    }

    setIsSharing(true);
    setShareError(null);
    try {
        const blob = await dataUrlToBlob(imageDataUrl);
        const file = new File([blob], 'my-coloring-masterpiece.png', { type: 'image/png' });
        
        await navigator.share({
            title: 'My Coloring Creation!',
            text: caption,
            files: [file],
        });
    } catch (error) {
        console.error('Error sharing:', error);
        if (error instanceof Error && error.name !== 'AbortError') {
             setShareError('Something went wrong while trying to share.');
        }
    } finally {
        setIsSharing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-full overflow-y-auto transform transition-all duration-300 scale-95 animate-modal-enter">
        <header className="flex items-center justify-between p-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Share your Creation</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Close modal">
            <CloseIcon className="w-6 h-6 text-gray-600" />
          </button>
        </header>
        <main className="p-6">
          {imageDataUrl ? (
            <img src={imageDataUrl} alt="Your colored masterpiece" className="w-full h-auto rounded-lg border shadow-md" />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
                <LoadingSpinner className="w-8 h-8 text-gray-500" />
            </div>
          )}
          <div className="mt-6">
            <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-2">Add a caption or hashtags:</label>
            <textarea
              id="caption"
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="e.g., Look what I colored! #ColoringBook #AIArt"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
        </main>
        <footer className="p-6 bg-gray-50 rounded-b-2xl flex flex-col sm:flex-row gap-4">
            <button
                onClick={handleSaveImage}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white font-bold rounded-lg shadow-md hover:bg-gray-700 transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-gray-300"
            >
                <DownloadIcon className="w-5 h-5" />
                Save to Device
            </button>
            <button
                onClick={handleShare}
                disabled={isSharing || !navigator.share}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:bg-indigo-300 disabled:cursor-not-allowed"
            >
                {isSharing ? <LoadingSpinner className="w-5 h-5"/> : <ShareIcon className="w-5 h-5" />}
                {isSharing ? 'Sharing...' : 'Share'}
            </button>
        </footer>
        {shareError && <p className="text-red-500 text-sm text-center p-4">{shareError}</p>}
      </div>
      <style>{`
        @keyframes modal-enter {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-modal-enter {
            animation: modal-enter 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ShareModal;