// src/components/Column.jsx
import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { motion } from "framer-motion";
import ColumnHeader from "./ColumnHeader";
import TaskList from "./TaskList";
import AddTaskSection from "./AddTaskSection";

const Column = React.memo(
  ({
    id,
    columnId,
    title,
    headerClass,
    tasks = [],
    onDeleteTask,
    onUpdateTaskDueDate,
    addTaskToColumn,
    onUpdateTask,
    expandedTaskId,
    onExpandTask,
    boardLabels = [],
    onCreateLabel,
    onUpdateLabel,
    onDeleteLabel,
  }) => {
    const { setNodeRef: setDroppableNodeRef, isOver: isOverColumn } =
      useDroppable({
        id: columnId,
        data: { type: "column", columnId: columnId },
      });

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          ease: "easeOut",
          delay: Math.random() * 0.15,
        }}
        ref={setDroppableNodeRef}
        className={`kanban-column ${
          isOverColumn
            ? "bg-[var(--drag-over-bg)] outline-2 outline-[var(--drag-over-outline)] outline-dashed -outline-offset-2"
            : ""
        }`}
        style={{
          fontFamily: "var(--cartoon-font)",
          minHeight: "calc(100vh - 260px)",
          maxHeight: "calc(100vh - 180px)",
        }}
      >
        <ColumnHeader title={title} headerClass={headerClass} />

        <TaskList
          tasks={tasks}
          columnId={columnId}
          onDeleteTask={onDeleteTask}
          onUpdateTaskDueDate={onUpdateTaskDueDate}
          onUpdateTask={onUpdateTask}
          expandedTaskId={expandedTaskId}
          onExpandTask={onExpandTask}
          boardLabels={boardLabels}
          onCreateLabel={onCreateLabel}
          onUpdateLabel={onUpdateLabel}
          onDeleteLabel={onDeleteLabel}
        />

        {!tasks.length && (
          <div
            className={`p-4 rounded-xl border-2 border-dashed text-center text-sm italic opacity-80 mt-3 ${
              isOverColumn ? "bg-opacity-50 bg-[var(--drag-over-bg)]" : ""
            }`}
            style={{
              borderColor: "var(--cartoon-border-medium)",
              color: "var(--cartoon-border-medium)",
              fontFamily: "var(--cartoon-font)",
            }}
          >
            {isOverColumn ? `Drop task in ${title}` : `No tasks in ${title}.`}
          </div>
        )}

        <AddTaskSection
          headerClass={headerClass}
          addTaskToColumn={addTaskToColumn}
          columnId={columnId}
          title={title}
        />
      </motion.div>
    );
  }
);
export default Column;
