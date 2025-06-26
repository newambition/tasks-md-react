// src/components/Column.jsx
import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";
import AddTaskForm from "./AddTaskForm";
import { FaPlus } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const plusButtonVariants = {
  hover: {
    scale: 1.15,
    rotate: 90,
    y: -1,
    x: -1,
    transition: { type: "spring", stiffness: 400, damping: 10 },
  },
  tap: { scale: 0.95, rotate: 0, y: 1, x: 1 },
};

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
    // Label Props
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
    const [isAddingTask, setIsAddingTask] = React.useState(false);

    const handleOpenQuickAdd = () => setIsAddingTask(true);
    const handleCancelQuickAdd = () => setIsAddingTask(false);

    const handleQuickAddTask = (taskText, dueDate) => {
      if (typeof addTaskToColumn === "function") {
        addTaskToColumn(taskText, columnId, dueDate);
      }
      setIsAddingTask(false);
    };

    // Determine button background color based on headerClass
    const getButtonBgStyle = () => {
      if (headerClass.includes("todo"))
        return {
          backgroundColor: "var(--cartoon-accent)",
          color: "var(--cartoon-border-dark)",
        };
      if (headerClass.includes("inprogress"))
        return {
          backgroundColor: "var(--cartoon-primary)",
          color: "var(--cartoon-text-light)",
        };
      if (headerClass.includes("done"))
        return {
          backgroundColor: "var(--cartoon-green)",
          color: "var(--cartoon-text-light)",
        };
      return {
        backgroundColor: "var(--cartoon-primary)",
        color: "var(--cartoon-text-light)",
      }; // Default
    };

    const getButtonTextStyle = () => {
      // For Add Task button text specifically
      if (headerClass.includes("todo")) return "text-cartoon-border-dark";
      return "text-cartoon-text-light";
    };

    const taskIds = React.useMemo(() => tasks.map((task) => task.id), [tasks]);

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
        // Applied .kanban-column, conditional drag over style
        className={`kanban-column ${
          isOverColumn
            ? "bg-[var(--drag-over-bg)] outline-2 outline-[var(--drag-over-outline)] outline-dashed -outline-offset-2"
            : ""
        }`}
        // minHeight and maxHeight are fine
        style={{
          fontFamily: "var(--cartoon-font)",
          minHeight: "calc(100vh - 260px)",
          maxHeight: "calc(100vh - 180px)",
        }}
      >
        {/* .kanban-header and headerClass handle styling from index.css */}
        <h2
          className={`kanban-header ${headerClass} flex-shrink-0 sticky top-0 z-10`}
        >
          {title}
        </h2>

        {/* .task-list-container from index.css */}
        <div className="task-list-container flex-grow overflow-y-auto">
          <SortableContext
            items={taskIds}
            strategy={verticalListSortingStrategy}
            id={columnId}
          >
            {/* .task-list for spacing from index.css */}
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
                    // Pass label props
                    boardLabels={boardLabels}
                    onCreateLabel={onCreateLabel}
                    onUpdateLabel={onUpdateLabel}
                    onDeleteLabel={onDeleteLabel}
                  />
                );
              })}
            </div>
          </SortableContext>

          <AnimatePresence>
            {isAddingTask && (
              <motion.div
                layout
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: "0.75rem" }} // Tailwind's mt-3
                exit={{
                  opacity: 0,
                  height: 0,
                  marginTop: 0,
                  transition: { duration: 0.2 },
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
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

          {!tasks.length && !isAddingTask && (
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
        </div>

        {!isAddingTask && (
          // Container for the plus button, with dark top border
          <div
            className="p-3 mt-auto flex justify-end flex-shrink-0 border-t-[2.5px]"
            style={{ borderColor: "var(--cartoon-border-dark)" }}
          >
            <motion.button
              variants={plusButtonVariants}
              whileHover="hover"
              whileTap="tap"
              // Styling for circular cartoon button
              className="w-8 h-8 rounded-full flex items-center justify-center border-[2.5px] border-solid shadow-[2px_2px_0px_var(--cartoon-border-dark)] transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cartoon-bg-light"
              style={{
                ...getButtonBgStyle(),
                borderColor: "var(--cartoon-border-dark)",
                fontFamily: "var(--cartoon-font)",
              }}
              onClick={handleOpenQuickAdd}
              title={`Add task to ${title}`}
            >
              <FaPlus className={getButtonTextStyle()} />{" "}
              {/* Ensure icon color contrasts */}
            </motion.button>
          </div>
        )}
      </motion.div>
    );
  }
);
export default Column;
