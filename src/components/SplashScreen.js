// src/components/SplashScreen.js
import React, { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext'; // To get theme colors

const SplashScreen = () => {
  const canvasRef = useRef(null);
  const { theme } = useTheme(); // 'light' or 'dark'

  // Define color palettes based on the theme
  // These are example RGBA values; adjust them to precisely match or complement your CSS variables.
  const lineColorsLight = [
    'rgba(37, 99, 235, 0.6)',   // Equivalent to blue-600 from Tailwind
    'rgba(29, 78, 216, 0.5)',   // Equivalent to blue-700
    'rgba(96, 165, 250, 0.4)',  // Equivalent to blue-400
    'rgba(129, 140, 248, 0.5)', // Equivalent to indigo-400
    'rgba(165, 180, 252, 0.4)', // Equivalent to indigo-300
  ];
  const lineColorsDark = [
    'rgba(96, 165, 250, 0.6)',  // Equivalent to blue-400
    'rgba(59, 130, 246, 0.5)',  // Equivalent to blue-500
    'rgba(129, 140, 248, 0.5)', // Equivalent to indigo-400
    'rgba(165, 180, 252, 0.4)', // Equivalent to indigo-300
    'rgba(199, 210, 254, 0.3)', // Equivalent to indigo-200
  ];
  const currentLineColors = theme === 'dark' ? lineColorsDark : lineColorsLight;
  // Use direct hex values if you know them, or retrieve from CSS variables if needed for exact match
  // For title, directly using CSS var in style prop is better if possible, or useTheme to pass down actual values
  const titleActualColor = theme === 'dark' ? 'var(--text-heading)' : 'var(--text-heading)';


  const draw = useCallback((ctx, frameCount) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const numLines = 25; // Number of flowing lines
    const maxAmplitude = ctx.canvas.height / 7; // Adjusted amplitude
    const time = frameCount * 0.004; // Slightly adjusted time progression

    for (let i = 0; i < numLines; i++) {
      ctx.beginPath();
      ctx.lineWidth = 1 + Math.random() * 1.0; // Slightly thinner lines
      ctx.strokeStyle = currentLineColors[i % currentLineColors.length];

      const freq = 0.008 + (i * 0.0015); // Adjusted frequency
      const amp = maxAmplitude * (0.4 + Math.sin(time * 0.5 + i * 0.3) * 0.3); // More dynamic amplitude
      const yOffset = ctx.canvas.height / 2 + Math.sin(i * 0.15 + time * 0.6) * (ctx.canvas.height / 5); // Adjusted vertical oscillation
      const phaseShift = i * 0.4;
      const speed = 0.4 + (i % 6) * 0.12; // Adjusted speed

      ctx.moveTo(0, yOffset + Math.sin(time * speed + phaseShift) * amp);
      for (let x = 0; x < ctx.canvas.width + 10; x += 10) { // Draw slightly beyond width for smoother edges
        const yNoise = (Math.random() - 0.2) * 2; // Tiny bit of random y-jitter for organic feel
        const y = yOffset + Math.sin(x * freq + time * speed + phaseShift) * amp * Math.cos(x / (150 + i*12) + time * 1.5) + yNoise;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }, [currentLineColors]); // Recreate draw if colors change (theme change)

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    let frameCount = 0;
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // No need to redraw immediately on resize, render loop will handle it
    };

    const render = () => {
      frameCount++;
      if (canvasRef.current) { // Check if canvas still mounted
        draw(context, frameCount);
      }
      animationFrameId = window.requestAnimationFrame(render);
    };

    resizeCanvas(); // Initial size
    window.addEventListener('resize', resizeCanvas);
    render(); // Start animation

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [draw]); // Effect depends on the draw function

  const splashContainerVariants = {
    hidden: { opacity: 1 }, // Start fully visible (or 0 if App.js handles initial as 'hidden')
    visible: { opacity: 1, transition: { duration: 1.2 } }, // Quick fade in if needed
    exit: { // Define the exit animation for smoother ease-out
      opacity: 0,
      transition: {
        duration: 1.2, // Duration of the fade out
        ease: "easeInOut" // Smoother easing
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5,
        duration: 2.0,
        ease: "easeOut"
      }
    }
  };
  
  const proVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.9, 
        duration: 2.5,
        ease: "easeOut"
      }
    }
  };

  const taglineVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 1.2,
        duration: 2.0,
        ease: "easeOut"
      }
    }
  };


  return (
    <motion.div
      key="splash-screen-container" // Key for AnimatePresence
      variants={splashContainerVariants}
      initial="hidden"   // Start with opacity 0 if App.js doesn't control initial via AnimatePresence's first render
      animate="visible" // Animate to visible state
      exit="exit"       // Use the defined exit animation
      className="splash-screen fixed inset-0 z-[10000] flex flex-col items-center justify-center"
      style={{ backgroundColor: 'var(--bg-primary)' }} // Theme-aware background
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-70 dark:opacity-50" /> {/* Added opacity to canvas */}
      <motion.div
        className="relative z-10 text-center select-none"
        initial="hidden" // Children animate from their own 'hidden' state
        animate="visible" // Trigger children's 'visible' state
      >
        <motion.h1
          variants={titleVariants}
          className="text-6xl md:text-8xl font-bold font-header tracking-tight"
          style={{ color: titleActualColor }}
        >
          TaskMD
          <motion.span 
            variants={proVariants}
            className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-400 dark:from-blue-400 dark:to-indigo-300"
          >
            Pro
          </motion.span>
        </motion.h1>
        <motion.p
            variants={taglineVariants} // Using new variants for tagline
            className="text-lg md:text-xl text-[var(--text-secondary)] mt-4"
        >
            Transform Your Markdown. Master Your Tasks.
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;