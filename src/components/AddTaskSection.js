
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus } from 'react-icons/fa';
import AddTaskForm from './AddTaskForm';

const plusButtonVariants = {
  hover: {
    scale: 1.15,
    rotate: 90,
    y: -1,
    x: -1,
    transition: { type: 'spring', stiffness: 400, damping: 10 },
  },
  tap: { scale: 0.95, rotate: 0, y: 1, x: 1 },
};

const AddTaskSection = ({
  headerClass,
  addTaskToColumn,
  columnId,
  title,
}) => {
  const [isAddingTask, setIsAddingTask] = useState(false);

  const handleOpenQuickAdd = () => setIsAddingTask(true);
  const handleCancelQuickAdd = () => setIsAddingTask(false);

  const handleQuickAddTask = (taskText, dueDate) => {
    if (typeof addTaskToColumn === 'function') {
      addTaskToColumn(taskText, columnId, dueDate);
    }
    setIsAddingTask(false);
  };

  const getButtonBgStyle = () => {
    if (headerClass.includes('todo'))
      return {
        backgroundColor: 'var(--cartoon-accent)',
        color: 'var(--cartoon-border-dark)',
      };
    if (headerClass.includes('inprogress'))
      return {
        backgroundColor: 'var(--cartoon-primary)',
        color: 'var(--cartoon-text-light)',
      };
    if (headerClass.includes('done'))
      return {
        backgroundColor: 'var(--cartoon-green)',
        color: 'var(--cartoon-text-light)',
      };
    return {
      backgroundColor: 'var(--cartoon-primary)',
      color: 'var(--cartoon-text-light)',
    }; // Default
  };

  const getButtonTextStyle = () => {
    if (headerClass.includes('todo')) return 'text-cartoon-border-dark';
    return 'text-cartoon-text-light';
  };

  return (
    <>
      <AnimatePresence>
        {isAddingTask && (
          <motion.div
            layout
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: '0.75rem' }}
            exit={{
              opacity: 0,
              height: 0,
              marginTop: 0,
              transition: { duration: 0.2 },
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="p-3 bg-white rounded-xl border-[2.5px] border-cartoon-border-dark shadow-[2px_2px_0px_var(--cartoon-shadow-color)]"
          >
            <AddTaskForm
              onAddTask={handleQuickAddTask}
              onCancel={handleCancelQuickAdd}
              columnHeaderClass={headerClass}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {!isAddingTask && (
        <div
          className="p-3 mt-auto flex justify-end flex-shrink-0 border-t-[2.5px]"
          style={{ borderColor: 'var(--cartoon-border-dark)' }}
        >
          <motion.button
            variants={plusButtonVariants}
            whileHover="hover"
            whileTap="tap"
            className="w-8 h-8 rounded-full flex items-center justify-center border-[2.5px] border-solid shadow-[2px_2px_0px_var(--cartoon-border-dark)] transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cartoon-bg-light"
            style={{
              ...getButtonBgStyle(),
              borderColor: 'var(--cartoon-border-dark)',
              fontFamily: 'var(--cartoon-font)',
            }}
            onClick={handleOpenQuickAdd}
            title={`Add task to ${title}`}
          >
            <FaPlus className={getButtonTextStyle()} />{" "}
          </motion.button>
        </div>
      )}
    </>
  );
};

export default AddTaskSection;
