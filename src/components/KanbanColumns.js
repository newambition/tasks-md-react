
import React, { useMemo } from 'react';
import Column from './Column';
import { COLUMN_IDS } from '../constants';

const KanbanColumns = ({
  tasks,
  onDeleteTask,
  onUpdateTaskDueDate,
  onUpdateTask,
  addTaskToBoardColumn,
  expandedTaskId,
  onExpandTask,
  boardLabels,
  onCreateLabel,
  onUpdateLabel,
  onDeleteLabel,
}) => {
  const columnConfig = useMemo(
    () => [
      {
        id: COLUMN_IDS[0],
        title: 'To Do',
        headerClass: 'header-todo',
        status: COLUMN_IDS[0],
      },
      {
        id: COLUMN_IDS[1],
        title: 'In Progress',
        headerClass: 'header-inprogress',
        status: COLUMN_IDS[1],
      },
      {
        id: COLUMN_IDS[2],
        title: 'Done',
        headerClass: 'header-done',
        status: COLUMN_IDS[2],
      },
    ],
    []
  );

  const columnIds = useMemo(
    () => columnConfig.map((col) => col.id),
    [columnConfig]
  );

  const tasksByColumn = useMemo(() => {
    return columnIds.reduce((acc, columnId) => {
      acc[columnId] = Array.isArray(tasks)
        ? tasks.filter((task) => task && task.status === columnId)
        : [];
      return acc;
    }, {});
  }, [tasks, columnIds]);

  return (
    <main className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 p-4 md:p-6 flex-grow">
      {columnConfig.map((col) => (
        <Column
          key={col.id}
          id={col.id}
          columnId={col.id}
          title={col.title}
          headerClass={col.headerClass}
          tasks={tasksByColumn[col.id] || []}
          onDeleteTask={onDeleteTask}
          onUpdateTaskDueDate={onUpdateTaskDueDate}
          onUpdateTask={onUpdateTask}
          addTaskToColumn={addTaskToBoardColumn}
          expandedTaskId={expandedTaskId}
          onExpandTask={onExpandTask}
          boardLabels={boardLabels}
          onCreateLabel={onCreateLabel}
          onUpdateLabel={onUpdateLabel}
          onDeleteLabel={onDeleteLabel}
        />
      ))}
    </main>
  );
};

export default KanbanColumns;
