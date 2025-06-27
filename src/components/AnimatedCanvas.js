
import React, { useEffect, useRef, useCallback } from 'react';

const AnimatedCanvas = () => {
  const canvasRef = useRef(null);

  const draw = useCallback((ctx, frameCount) => {
    const lineColorsCartoon = [
      'rgba(0, 174, 239, 0.6)',
      'rgba(255, 107, 107, 0.5)',
      'rgba(255, 209, 102, 0.5)',
      'rgba(6, 214, 160, 0.4)',
      'rgba(0, 174, 239, 0.3)',
    ];
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const numLines = 25;
    const maxAmplitude = ctx.canvas.height / 7;
    const time = frameCount * 0.004;

    for (let i = 0; i < numLines; i++) {
      ctx.beginPath();
      ctx.lineWidth = 1.5 + Math.random() * 1.0;
      ctx.strokeStyle = lineColorsCartoon[i % lineColorsCartoon.length];

      const freq = 0.008 + i * 0.0015;
      const amp = maxAmplitude * (0.4 + Math.sin(time * 0.5 + i * 0.3) * 0.3);
      const yOffset =
        ctx.canvas.height / 2 +
        Math.sin(i * 0.15 + time * 0.6) * (ctx.canvas.height / 5);
      const phaseShift = i * 0.4;
      const speed = 0.4 + (i % 6) * 0.12;

      ctx.moveTo(0, yOffset + Math.sin(time * speed + phaseShift) * amp);
      for (let x = 0; x < ctx.canvas.width + 10; x += 10) {
        const yNoise = (Math.random() - 0.2) * 2;
        const y =
          yOffset +
          Math.sin(x * freq + time * speed + phaseShift) *
            amp *
            Math.cos(x / (150 + i * 12) + time * 1.5) +
          yNoise;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    let frameCount = 0;
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const render = () => {
      frameCount++;
      if (canvasRef.current) {
        draw(context, frameCount);
      }
      animationFrameId = window.requestAnimationFrame(render);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-50"
    />
  );
};

export default AnimatedCanvas;
