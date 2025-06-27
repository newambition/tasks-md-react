
import React from 'react';
import { motion } from 'framer-motion';
import { LabelManager } from '../utils/labelManager';

const TaskCardEditor = ({
  task,
  editedText,
  setEditedText,
  handleSave,
  onExpand,
  currentDueDate,
  handleDateChange,
  internalHandleDateBlur,
  internalHandleDateKeyDown,
  dateInputRef,
  textInputRef,
  boardLabels,
  onUpdateTask,
  onCreateLabel,
}) => {
  const convertToInputFormat = (ddmmyy) => {
    if (!ddmmyy) return '';
    try {
      const [day, month, year] = ddmmyy.split('-');
      const fullYear = 2000 + parseInt(year, 10);
      return `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    } catch (e) {
      console.error('Error converting date to input format:', ddmmyy, e);
      return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0, marginTop: 0 }}
      animate={{ opacity: 1, height: 'auto', marginTop: '12px' }}
      exit={{ opacity: 0, height: 0, marginTop: 0 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="overflow-visible"
      onClick={(e) => e.stopPropagation()}
    >
      <textarea
        ref={textInputRef}
        className="input-base w-full text-sm flex-grow"
        style={{
          minHeight: '60px',
          resize: 'none',
        }}
        value={editedText}
        onChange={(e) => setEditedText(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSave();
          } else if (e.key === 'Escape') {
            onExpand();
          }
        }}
      />

      <div className="mt-3">
        <input
          ref={dateInputRef}
          type="date"
          value={convertToInputFormat(currentDueDate)}
          onChange={handleDateChange}
          onBlur={internalHandleDateBlur}
          onKeyDown={internalHandleDateKeyDown}
          onClick={(e) => e.stopPropagation()}
          className="p-1 text-xs w-auto inline-block border-2 rounded-md outline-none"
          style={{
            fontFamily: 'var(--cartoon-font)',
            borderColor: 'var(--cartoon-border-dark)',
            backgroundColor: 'white',
            color: 'var(--cartoon-text)',
            boxShadow: '1px 1px 0px var(--cartoon-shadow-color)',
          }}
        />
      </div>

      <div
        className="flex justify-between items-end gap-2 pt-3 border-t-2 border-dashed mt-3"
        style={{ borderColor: 'var(--cartoon-border-medium)' }}
      >
        <LabelManager
          taskLabels={task.labels || []}
          boardLabels={boardLabels}
          onUpdateTask={(updates) => onUpdateTask(task.id, updates)}
          onCreateLabel={onCreateLabel}
        />
        <div className="flex justify-end gap-2">
          <button
            className="btn btn-secondary text-sm px-4 py-2"
            onClick={onExpand}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary text-sm px-4 py-2"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCardEditor;
