
import React from 'react';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import TaskCard from './TaskCard';

const TaskList = ({
  tasks,
  columnId,
  onDeleteTask,
  onUpdateTaskDueDate,
  onUpdateTask,
  expandedTaskId,
  onExpandTask,
  boardLabels,
  onCreateLabel,
  onUpdateLabel,
  onDeleteLabel,
}) => {
  const taskIds = React.useMemo(() => tasks.map((task) => task.id), [tasks]);

  return (
    <div className="task-list-container flex-grow overflow-y-auto">
      <SortableContext
        items={taskIds}
        strategy={verticalListSortingStrategy}
        id={columnId}
      >
        <div className="task-list">
          {tasks.map((task) => {
            if (!task || !task.id) {
              return null;
            }
            return (
              <TaskCard
                key={task.id}
                id={task.id}
                task={task}
                columnId={columnId}
                onDeleteTask={onDeleteTask}
                onUpdateTaskDueDate={onUpdateTaskDueDate}
                onUpdateTask={onUpdateTask}
                isExpanded={expandedTaskId === task.id}
                onExpand={() =>
                  onExpandTask(expandedTaskId === task.id ? null : task.id)
                }
                boardLabels={boardLabels}
                onCreateLabel={onCreateLabel}
                onUpdateLabel={onUpdateLabel}
                onDeleteLabel={onDeleteLabel}
              />
            );
          })}
        </div>
      </SortableContext>
    </div>
  );
};

export default TaskList;
