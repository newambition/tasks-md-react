
import React from 'react';
import { motion } from 'framer-motion';

const SplashTagline = () => {
  const taglineColor = 'var(--cartoon-text)';

  const taglineVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 1.0,
        duration: 1.8,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.p
      variants={taglineVariants}
      className="text-lg md:text-xl mt-5"
      style={{ color: taglineColor, fontWeight: 600 }}
    >
      Transform Your Markdown. Master Your Tasks.
    </motion.p>
  );
};

export default SplashTagline;
