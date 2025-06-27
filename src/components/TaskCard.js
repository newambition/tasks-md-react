// src/components/TaskCard.jsx
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskCardDisplay from "./TaskCardDisplay";
import TaskCardEditor from "./TaskCardEditor";
import useTaskCardEditing from "./useTaskCardEditing";

const TaskCard = React.memo(
  ({
    id,
    task = {},
    columnId,
    onDeleteTask,
    onUpdateTaskDueDate,
    onUpdateTask,
    isExpanded,
    onExpand,
    isDraggingOverlay = false,
    boardLabels = [],
    onCreateLabel,
  }) => {
    const {
      currentDueDate,
      editedText,
      setEditedText,
      dateInputRef,
      textInputRef,
      handleDateChange,
      internalHandleDateClick,
      internalHandleDateBlur,
      internalHandleDateKeyDown,
      handleSave,
    } = useTaskCardEditing(task, onUpdateTaskDueDate, onUpdateTask, onExpand);

    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: id,
      data: {
        type: "task",
        task,
        columnIdOrigin: task.status,
      },
      disabled: isExpanded,
    });

    const liftScale = 1.03;

    const sortableStyle = {
      transform: CSS.Transform.toString(transform),
      transition:
        transition ||
        `transform 250ms ease, box-shadow 200ms ease, opacity 200ms ease-out`,
      fontFamily: "var(--cartoon-font)",
    };

    let combinedStyle = { ...sortableStyle };
    let cardClasses = `card-base p-4 flex flex-col justify-between touch-manipulation`;

    if (isDraggingOverlay) {
      combinedStyle = {
        ...combinedStyle,
        opacity: 0.9,
        cursor: "grabbing",
        zIndex: 9999,
        minHeight: "90px",
        transform: `scale(${liftScale}) rotate(-1deg)`,
        boxShadow: "8px 8px 0px var(--cartoon-shadow-color)",
      };
    } else if (isDragging) {
      combinedStyle = {
        ...combinedStyle,
        opacity: 0.85,
        cursor: "grabbing",
        zIndex: 9999,
        minHeight: "90px",
        transform: CSS.Transform.toString(
          transform
            ? {
                ...transform,
                scaleX: liftScale,
                scaleY: liftScale,
                rotate: "-1deg",
              }
            : { scaleX: liftScale, scaleY: liftScale, rotate: "-1deg" }
        ),
        boxShadow: "7px 7px 0px var(--cartoon-shadow-color)",
      };
      cardClasses = cardClasses
        .replace("hover:transform", "")
        .replace("hover:translate-x-[-2px]", "")
        .replace("hover:translate-y-[-2px]", "")
        .replace("hover:rotate-[-1deg]", "")
        .replace("hover:shadow-[6px_6px_0px_var(--cartoon-shadow-color)]", "");
    } else {
      combinedStyle = {
        ...combinedStyle,
        minHeight: "90px",
        cursor: isExpanded ? "default" : "grab",
      };
    }

    const assignedLabels = React.useMemo(() => {
      if (!boardLabels || !Array.isArray(boardLabels)) {
        return [];
      }
      return (task.labels || [])
        .map((labelId) => boardLabels.find((l) => l.id === labelId))
        .filter(Boolean);
    }, [task.labels, boardLabels]);

    if (!task || !task.id) {
      return (
        <div className="card-base p-4 text-cartoon-secondary border-cartoon-secondary shadow-[4px_4px_0px_var(--cartoon-secondary)] h-[90px]">
          Invalid Task Data (ID missing)
        </div>
      );
    }
    if (!columnId && !task.status) {
      return (
        <div className="card-base p-4 text-cartoon-secondary border-cartoon-secondary shadow-[4px_4px_0px_var(--cartoon-secondary)] h-[90px]">
          Invalid Task Data (Status missing)
        </div>
      );
    }

    const handleExpandClick = (e) => {
      if (e.target.closest("button, input, textarea")) {
        return;
      }
      onExpand();
    };

    return (
      <div
        ref={setNodeRef}
        style={combinedStyle}
        className={cardClasses}
        data-task-id={task.id}
        onClick={handleExpandClick}
        {...attributes}
        {...listeners}
      >
        {!isExpanded ? (
          <TaskCardDisplay
            task={task}
            onDeleteTask={onDeleteTask}
            onExpand={onExpand}
            assignedLabels={assignedLabels}
            internalHandleDateClick={internalHandleDateClick}
          />
        ) : (
          <TaskCardEditor
            task={task}
            editedText={editedText}
            setEditedText={setEditedText}
            handleSave={handleSave}
            onExpand={onExpand}
            currentDueDate={currentDueDate}
            handleDateChange={handleDateChange}
            internalHandleDateBlur={internalHandleDateBlur}
            internalHandleDateKeyDown={internalHandleDateKeyDown}
            dateInputRef={dateInputRef}
            textInputRef={textInputRef}
            boardLabels={boardLabels}
            onUpdateTask={onUpdateTask}
            onCreateLabel={onCreateLabel}
          />
        )}
      </div>
    );
  }
);
export default TaskCard;
