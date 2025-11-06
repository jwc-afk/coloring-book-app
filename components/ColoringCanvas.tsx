import React, { useEffect, useCallback, forwardRef } from 'react';

interface ColoringCanvasProps {
  imageSrc: string;
  selectedColor: string;
}

const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
};

const ColoringCanvas = forwardRef<HTMLCanvasElement, ColoringCanvasProps>(({ imageSrc, selectedColor }, ref) => {
  useEffect(() => {
    const canvas = (ref as React.RefObject<HTMLCanvasElement>).current;
    if (!canvas) return;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) return;

    const image = new Image();
    image.crossOrigin = 'Anonymous';
    image.src = imageSrc;
    image.onload = () => {
      // Fit image to a max size for performance and consistency
      const MAX_WIDTH = 800;
      const MAX_HEIGHT = 800;
      let width = image.width;
      let height = image.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width = Math.round((width * MAX_HEIGHT) / height);
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      context.drawImage(image, 0, 0, width, height);
    };
  }, [imageSrc, ref]);

  const floodFill = useCallback((ctx: CanvasRenderingContext2D, startX: number, startY: number, fillColor: { r: number; g: number; b: number }) => {
      const { width, height } = ctx.canvas;
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      const startPos = (startY * width + startX) * 4;
      const startR = data[startPos];
      const startG = data[startPos + 1];
      const startB = data[startPos + 2];

      // If the color is the same, do nothing
      if (fillColor.r === startR && fillColor.g === startG && fillColor.b === startB) {
        return;
      }

      // Don't fill black lines
      if (startR < 50 && startG < 50 && startB < 50) {
        return;
      }

      const pixelStack: [number, number][] = [[startX, startY]];

      while (pixelStack.length > 0) {
        const [x, y] = pixelStack.pop()!;
        const currentPos = (y * width + x) * 4;

        if (
            data[currentPos] === startR &&
            data[currentPos + 1] === startG &&
            data[currentPos + 2] === startB
        ) {
            data[currentPos] = fillColor.r;
            data[currentPos + 1] = fillColor.g;
            data[currentPos + 2] = fillColor.b;

            if (y + 1 < height) pixelStack.push([x, y + 1]);
            if (y - 1 >= 0) pixelStack.push([x, y - 1]);
            if (x + 1 < width) pixelStack.push([x + 1, y]);
            if (x - 1 >= 0) pixelStack.push([x - 1, y]);
        }
      }
      ctx.putImageData(imageData, 0, 0);
    },
    []
  );

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = (ref as React.RefObject<HTMLCanvasElement>).current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor((event.clientX - rect.left) * scaleX);
    const y = Math.floor((event.clientY - rect.top) * scaleY);
    
    const fillColor = hexToRgb(selectedColor);
    if (fillColor) {
        floodFill(ctx, x, y, fillColor);
    }
  };

  return (
    <canvas
      ref={ref}
      onClick={handleCanvasClick}
      className="max-w-full max-h-full object-contain cursor-pointer rounded-lg shadow-lg bg-white"
      style={{ touchAction: 'none' }}
    />
  );
});

export default ColoringCanvas;