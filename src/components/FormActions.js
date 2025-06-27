
import React from 'react';
import { motion } from 'framer-motion';

const formButtonVariants = {
  hover: { scale: 1.05, y: -1, transition: { duration: 0.15 } },
  tap: { scale: 0.95, y: 1 },
};

const FormActions = ({
  onCancel,
  columnHeaderClass,
}) => {
  const getButtonBgStyle = () => {
    if (columnHeaderClass.includes('todo'))
      return {
        backgroundColor: 'var(--cartoon-accent)',
        color: 'var(--cartoon-border-dark)',
      };
    if (columnHeaderClass.includes('inprogress'))
      return {
        backgroundColor: 'var(--cartoon-primary)',
        color: 'var(--cartoon-text-light)',
      };
    if (columnHeaderClass.includes('done'))
      return {
        backgroundColor: 'var(--cartoon-green)',
        color: 'var(--cartoon-text-light)',
      };
    return {
      backgroundColor: 'var(--cartoon-primary)',
      color: 'var(--cartoon-text-light)',
    };
  };

  return (
    <div className="flex justify-end items-center gap-2.5">
      <motion.button
        type="button"
        variants={formButtonVariants}
        whileHover="hover"
        whileTap="tap"
        className="btn btn-secondary text-sm px-4 py-2"
        style={{
          fontFamily: 'var(--cartoon-font)',
          color: 'var(--cartoon-text-dark)',
        }}
        onClick={onCancel}
      >
        Cancel
      </motion.button>
      <motion.button
        type="submit"
        id="add-task-btn"
        variants={formButtonVariants}
        whileHover="hover"
        whileTap="tap"
        className="btn btn-primary text-sm px-4 py-2"
        style={{
          ...getButtonBgStyle(),
          fontFamily: 'var(--cartoon-font)',
        }}
      >
        Add Task
      </motion.button>
    </div>
  );
};

export default FormActions;
