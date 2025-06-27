
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className="relative flex items-center cursor-pointer select-none p-1"
      onClick={toggleTheme}
      title={
        theme === 'light'
          ? 'Switch to Dark Mode'
          : 'Switch to Light Mode'
      }
      style={{
        border: '2px solid var(--cartoon-border-dark)',
        boxShadow: '2px 2px 0px var(--cartoon-shadow-color)',
        borderRadius: '30px',
        width: '48px',
        height: '28px',
      }}
    >
      <motion.div
        className="w-full h-full rounded-full"
        style={{
          backgroundColor:
            theme === 'dark'
              ? 'var(--cartoon-secondary)'
              : 'var(--cartoon-border-medium)',
          border: '2px solid var(--cartoon-border-dark)',
          borderRadius: '28px',
        }}
        layout
      />
      <motion.div
        className="absolute top-0 left-0 flex items-center h-full w-full px-[3px]"
        layout
      >
        <motion.span
          className="flex items-center justify-center rounded-full"
          style={{
            width: '20px',
            height: '20px',
            backgroundColor: 'var(--cartoon-text-light)',
            border: '1px solid var(--cartoon-border-dark)',
            x: theme === 'dark' ? '28px' : '2px',
          }}
          layout
          transition={{ type: 'spring', stiffness: 600, damping: 25 }}
        ></motion.span>
      </motion.div>
    </div>
  );
};

export default ThemeToggle;
