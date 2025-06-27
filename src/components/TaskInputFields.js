
import React from 'react';

const TaskInputFields = ({
  taskText,
  setTaskText,
  dueDate,
  setDueDate,
}) => {
  return (
    <>
      <div className="flex-grow">
        <label htmlFor="new-task-input" className="sr-only">
          Task Description
        </label>
        <textarea
          id="new-task-input"
          placeholder="Enter task description..."
          className="input-base w-full text-sm"
          rows="3"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          autoFocus
        />
      </div>
      <div className="flex-shrink-0">
        <label htmlFor="task-card-date" className="sr-only">
          Due Date
        </label>
        <input
          type="date"
          id="task-card-date"
          title="Due Date (Optional)"
          className="p-1 text-xs w-auto inline-block border-2 rounded-md outline-none"
          style={{
            fontFamily: 'var(--cartoon-font)',
            borderColor: 'var(--cartoon-border-dark)',
            backgroundColor: 'white',
            color: 'var(--cartoon-text-secondary)',
            boxShadow: '1px 1px 0px var(--cartoon-shadow-color)',
          }}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>
    </>
  );
};

export default TaskInputFields;
