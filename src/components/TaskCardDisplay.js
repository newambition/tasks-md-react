
import React from 'react';
import { formatDate, isOverdue, getDueDateStatus } from '../utils/helpers';

const TaskCardDisplay = ({
  task,
  onDeleteTask,
  onExpand,
  assignedLabels,
  internalHandleDateClick,
}) => {
  const overdue =
    task.dueDate && task.status !== 'done' && isOverdue(task.dueDate);
  const displayDate = task.dueDate ? formatDate(task.dueDate) : null;
  const dateStatus = task.dueDate ? getDueDateStatus(task.dueDate) : null;

  let dateTitle = 'Click to set due date';
  if (displayDate) {
    dateTitle = overdue ? `Overdue! (${displayDate})` : `Due ${displayDate}`;
  }

  const getPillStyles = (status) => {
    switch (status) {
      case 'overdue':
        return {
          bg: 'var(--cartoon-secondary)',
          text: 'var(--cartoon-text-light)',
          label: 'Past Due',
        };
      case 'today':
        return {
          bg: 'var(--cartoon-accent)',
          text: 'var(--cartoon-border-dark)',
          label: 'Due Today',
        };
      case 'tomorrow':
        return {
          bg: 'var(--cartoon-primary)',
          text: 'var(--cartoon-text-light)',
          label: 'Due Tomorrow',
        };
      case 'upcoming':
        return {
          bg: 'var(--cartoon-green)',
          text: 'var(--cartoon-text-light)',
          label: 'Upcoming',
        };
      default:
        return null;
    }
  };

  const pillStyles = dateStatus ? getPillStyles(dateStatus) : null;

  return (
    <>
      <div className="flex justify-between items-start mb-2 gap-2">
        <span
          className="task-card-text text-xs leading-snug break-words flex-grow"
          style={{ color: 'var(--cartoon-text)', fontWeight: 400 }}
        >
          {task.text}
        </span>
        <button
          className="w-5 h-5 p-0 flex items-center justify-center rounded-full border-2 border-solid bg-white shadow-[1.5px_1.5px_0px_var(--cartoon-border-dark)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[0.5px_0.5px_0px_var(--cartoon-border-dark)] active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-none transition-all duration-100 ease-in-out flex-shrink-0"
          style={{
            borderColor: 'var(--cartoon-border-dark)',
            color: 'var(--cartoon-secondary)',
          }}
          title="Delete task"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteTask(task.id);
          }}
        >
          <span className="text-lg leading-none font-bold">&times;</span>
        </button>
      </div>
      <div className="task-card-bottom-row flex items-center flex-wrap gap-2 min-h-[24px] mt-auto">
        <div className="task-card-date-container flex items-center">
          <div
            className={`task-card-date text-xs inline-flex items-center cursor-pointer p-0.5 rounded-md hover:bg-cartoon-bg-medium`}
            style={{
              fontFamily: 'var(--cartoon-font)',
              color: task.dueDate
                ? overdue
                  ? 'var(--cartoon-secondary)'
                  : 'var(--cartoon-text)'
                : 'var(--cartoon-border-medium)',
              fontWeight: task.dueDate && overdue ? 700 : 400,
            }}
            title={dateTitle}
            onClick={internalHandleDateClick}
          >
            <span
              className={`task-card-date-icon mr-1.5 text-sm ${
                task.dueDate && overdue
                  ? 'text-[var(--cartoon-secondary)]'
                  : 'text-[var(--cartoon-text)]'
              }`}
            >
              📅
            </span>
            <span className="task-card-date-text">
              {displayDate ? displayDate : 'Set Due Date'}
            </span>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {pillStyles && (
            <div
              className="task-date-pill text-xs px-2 py-0.5 rounded-full border-2 font-bold inline-flex items-center justify-center"
              style={{
                backgroundColor: pillStyles.bg,
                color: pillStyles.text,
                borderColor: 'var(--cartoon-border-dark)',
                boxShadow: '1px 1px 0px var(--cartoon-border-dark)',
              }}
            >
              {pillStyles.label}
            </div>
          )}
          {assignedLabels.map((label) => (
            <div
              key={label.id}
              className="text-xs px-2 py-0.5 rounded-full border-2 font-bold"
              style={{
                backgroundColor: label.color,
                color: 'var(--cartoon-text-light)',
                borderColor: 'var(--cartoon-border-dark)',
                boxShadow: '1px 1px 0px var(--cartoon-border-dark)',
              }}
            >
              {label.name}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TaskCardDisplay;
