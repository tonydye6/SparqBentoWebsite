
import { useEffect, useRef } from 'react';

interface PixelPatternProps {
  className?: string;
}

export function PixelPattern({ className }: PixelPatternProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const createCryptoTexture = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < height; i += 1) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        
        for (let x = 0; x < width; x++) {
          const y = i + Math.sin(x * 0.01) * 1;
          ctx.lineTo(x, y);
        }
        
        ctx.stroke();
      }
    };

    const createNoiseTexture = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const random = Math.random() * 0.15;
        const value = 255 * random;
        
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
        data[i + 3] = 25;
      }
      
      ctx.putImageData(imageData, 0, 0);
    };

    // Apply both textures
    createCryptoTexture(ctx, canvas.width, canvas.height);
    createNoiseTexture(ctx, canvas.width, canvas.height);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} />;
}
