import React from 'react';

interface ColorPaletteProps {
  palette: string[];
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

const ColorPalette: React.FC<ColorPaletteProps> = ({ palette, selectedColor, onColorSelect }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm p-3 shadow-top-lg">
      <div className="flex justify-center items-center space-x-2 overflow-x-auto pb-2">
        {palette.map((color, index) => {
            const isWhite = color === '#FFFFFF';
            return (
              <button
                key={`${color}-${index}`}
                onClick={() => onColorSelect(color)}
                className={`relative w-12 h-12 md:w-14 md:h-14 rounded-full flex-shrink-0 border-2 transition-transform transform hover:scale-110 ${
                  selectedColor === color ? 'border-indigo-500 scale-110 ring-2 ring-indigo-300' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Select color ${color}`}
                title={isWhite ? "White / Eraser" : `Color ${color}`}
              >
                {isWhite && (
                  <span className="absolute inset-0 flex items-center justify-center text-gray-500 text-xs font-bold">
                    Erase
                  </span>
                )}
              </button>
            )
        })}
      </div>
    </div>
  );
};

// Custom shadow utility class defined via style tag as we cannot use custom CSS files
const ShadowStyle = () => (
    <style>{`
      .shadow-top-lg {
        box-shadow: 0 -10px 15px -3px rgba(0, 0, 0, 0.1), 0 -4px 6px -2px rgba(0, 0, 0, 0.05);
      }
    `}</style>
)

const ColorPaletteWrapper: React.FC<ColorPaletteProps> = (props) => (
    <>
        <ShadowStyle />
        <ColorPalette {...props} />
    </>
)

export default ColorPaletteWrapper;