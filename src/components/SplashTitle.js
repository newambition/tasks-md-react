
import React from 'react';
import { motion } from 'framer-motion';

const SplashTitle = () => {
  const titleTaskMDColor = 'var(--cartoon-primary)';
  const titleProColor = 'var(--cartoon-accent)';

  const titleVariants = {
    hidden: { opacity: 0, y: 25, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: 0.4,
        duration: 1.8,
        ease: 'easeOut',
      },
    },
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
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.h1
      variants={titleVariants}
      className="text-6xl md:text-8xl font-extrabold tracking-tight"
      style={{ color: titleTaskMDColor }}
    >
      TaskMD
      <motion.span
        variants={proVariants}
        style={{ color: titleProColor, marginLeft: '0.1em' }}
      >
        Pro
      </motion.span>
    </motion.h1>
  );
};

export default SplashTitle;
