// src/components/KanbanBoard.jsx
import React, { useState } from "react";
import KanbanDndContext from "./KanbanDndContext";
import KanbanColumns from "./KanbanColumns";

const KanbanBoard = ({
  tasks = [],
  setTasks,
  onDeleteTask,
  onUpdateTaskDueDate,
  onUpdateTask,
  addTaskToBoardColumn,
  boardLabels = [],
  onCreateLabel,
  onUpdateLabel,
  onDeleteLabel,
}) => {
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  return (
    <KanbanDndContext tasks={tasks} setTasks={setTasks} boardLabels={boardLabels}>
      <KanbanColumns
        tasks={tasks}
        onDeleteTask={onDeleteTask}
        onUpdateTaskDueDate={onUpdateTaskDueDate}
        onUpdateTask={onUpdateTask}
        addTaskToBoardColumn={addTaskToBoardColumn}
        expandedTaskId={expandedTaskId}
        onExpandTask={setExpandedTaskId}
        boardLabels={boardLabels}
        onCreateLabel={onCreateLabel}
        onUpdateLabel={onUpdateLabel}
        onDeleteLabel={onDeleteLabel}
      />
    </KanbanDndContext>
  );
};

export default KanbanBoard;
