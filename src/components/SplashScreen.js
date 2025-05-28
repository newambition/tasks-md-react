// src/components/SplashScreen.js
import React, { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
// Removed useTheme as we are standardizing to a single cartoon theme for the splash
// import { useTheme } from '../context/ThemeContext';

const SplashScreen = () => {
  const canvasRef = useRef(null);
  // const { theme } = useTheme(); // No longer needed for cartoon style

  // Define cartoon color palette for animated lines
  const lineColorsCartoon = [
    'rgba(0, 174, 239, 0.6)',   // --cartoon-primary with alpha
    'rgba(255, 107, 107, 0.5)', // --cartoon-secondary with alpha
    'rgba(255, 209, 102, 0.5)', // --cartoon-accent with alpha
    'rgba(6, 214, 160, 0.4)',   // --cartoon-green with alpha
    'rgba(0, 174, 239, 0.3)',   // Lighter --cartoon-primary
  ];
  // const currentLineColors = theme === 'dark' ? lineColorsDark : lineColorsLight; // Replaced by single cartoon theme

  // Colors for title elements
  const titleTaskMDColor = 'var(--cartoon-primary)';
  const titleProColor = 'var(--cartoon-accent)';
  const taglineColor = 'var(--cartoon-text)';


  const draw = useCallback((ctx, frameCount) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const numLines = 25;
    const maxAmplitude = ctx.canvas.height / 7;
    const time = frameCount * 0.004;

    for (let i = 0; i < numLines; i++) {
      ctx.beginPath();
      ctx.lineWidth = 1.5 + Math.random() * 1.0; // Slightly thicker for cartoon feel
      ctx.strokeStyle = lineColorsCartoon[i % lineColorsCartoon.length];

      const freq = 0.008 + (i * 0.0015);
      const amp = maxAmplitude * (0.4 + Math.sin(time * 0.5 + i * 0.3) * 0.3);
      const yOffset = ctx.canvas.height / 2 + Math.sin(i * 0.15 + time * 0.6) * (ctx.canvas.height / 5);
      const phaseShift = i * 0.4;
      const speed = 0.4 + (i % 6) * 0.12;

      ctx.moveTo(0, yOffset + Math.sin(time * speed + phaseShift) * amp);
      for (let x = 0; x < ctx.canvas.width + 10; x += 10) {
        const yNoise = (Math.random() - 0.2) * 2;
        const y = yOffset + Math.sin(x * freq + time * speed + phaseShift) * amp * Math.cos(x / (150 + i*12) + time * 1.5) + yNoise;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }, [lineColorsCartoon]); // Dependency updated

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

  const splashContainerVariants = {
    hidden: { opacity: 1 }, // Starts visible, children animate in
    visible: { opacity: 1, transition: { duration: 1.2 } },
    exit: {
      opacity: 0,
      transition: {
        duration: 1.2,
        ease: "easeInOut"
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 25, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: 0.4,
        duration: 1.8,
        ease: "easeOut" // Reverted to "easeOut" to fix TypeError
      }
    }
  };
  
  const proVariants = {
    hidden: { opacity: 0, x: -15, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        delay: 0.7,
        duration: 2.0,
        ease: "easeOut" // Reverted to "easeOut" to fix TypeError
      }
    }
  };

  const taglineVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 1.0,
        duration: 1.8,
        ease: "easeOut"
      }
    }
  };


  return (
    <motion.div
      key="splash-screen-container"
      variants={splashContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="splash-screen fixed inset-0 z-[10000] flex flex-col items-center justify-center"
      // Using cartoon background color and font
      style={{ backgroundColor: 'var(--cartoon-bg-light)', fontFamily: 'var(--cartoon-font)' }}
    >
      {/* Adjusted canvas opacity for cartoon theme */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-50" />
      <motion.div
        className="relative z-10 text-center select-none"
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={titleVariants}
          // Using font-extrabold for 800 weight, tracking-tight for style
          className="text-6xl md:text-8xl font-extrabold tracking-tight"
          style={{ color: titleTaskMDColor }} // Applied cartoon primary color
        >
          TaskMD
          <motion.span 
            variants={proVariants}
            // Removed gradient, using solid cartoon accent color
            style={{ color: titleProColor, marginLeft: '0.1em' }} // Added slight margin for "Pro"
          >
            Pro
          </motion.span>
        </motion.h1>
        <motion.p
            variants={taglineVariants}
            className="text-lg md:text-xl mt-5" // Adjusted margin-top
            style={{ color: taglineColor, fontWeight: 600 }} // Using cartoon text color and semi-bold
        >
            Transform Your Markdown. Master Your Tasks.
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;