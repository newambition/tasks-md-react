// src/components/TaskCard.jsx
import React, { useState, useRef, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { formatDate, isOverdue, getDueDateStatus } from "../utils/helpers";
import { motion, AnimatePresence } from "framer-motion";
import { LabelManager } from "../utils/labelManager";

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
    // Label props
    boardLabels = [],
    onCreateLabel,
    onUpdateLabel,
    onDeleteLabel,
  }) => {
    const [isEditingDate, setIsEditingDate] = useState(false);
    const [currentDueDate, setCurrentDueDate] = useState(task?.dueDate || "");
    const [editedText, setEditedText] = useState(task?.text || "");
    const dateInputRef = useRef(null);
    const textInputRef = useRef(null);

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

    const liftScale = 1.03; // Slightly reduced scale for a more subtle lift

    // Base style from useSortable, we will add to this or override
    const sortableStyle = {
      transform: CSS.Transform.toString(transform),
      transition:
        transition ||
        `transform 250ms ease, box-shadow 200ms ease, opacity 200ms ease-out`, // Added box-shadow to transition
      fontFamily: "var(--cartoon-font)", // Ensure cartoon font is applied
    };

    let combinedStyle = { ...sortableStyle };
    let cardClasses = `card-base p-4 flex flex-col justify-between touch-manipulation`; // Using p-4 for 1rem

    if (isDraggingOverlay) {
      combinedStyle = {
        ...combinedStyle,
        opacity: 0.9,
        cursor: "grabbing",
        zIndex: 9999,
        minHeight: "90px", // Min height for consistency
        transform: `scale(${liftScale}) rotate(-1deg)`, // Apply scale and slight rotate
        boxShadow: "8px 8px 0px var(--cartoon-shadow-color)", // Prominent cartoon shadow
      };
    } else if (isDragging) {
      combinedStyle = {
        ...combinedStyle,
        opacity: 0.85,
        cursor: "grabbing",
        zIndex: 9999,
        minHeight: "90px",
        // Apply scale from useSortable's transform, add rotation and stronger shadow
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
        boxShadow: "7px 7px 0px var(--cartoon-shadow-color)", // Hover-like shadow when dragging
      };
      // Remove hover effects from card-base if isDragging to prevent conflict
      cardClasses = cardClasses
        .replace("hover:transform", "")
        .replace("hover:translate-x-[-2px]", "")
        .replace("hover:translate-y-[-2px]", "")
        .replace("hover:rotate-[-1deg]", "")
        .replace("hover:shadow-[6px_6px_0px_var(--cartoon-shadow-color)]", "");
    } else {
      // Default state, rely on .card-base for shadow and hover effects
      combinedStyle = {
        ...combinedStyle,
        minHeight: "90px", // Consistent min height
        cursor: isExpanded ? "default" : "grab",
      };
    }

    // Derived state for labels
    const assignedLabels = React.useMemo(() => {
      if (!boardLabels || !Array.isArray(boardLabels)) {
        return [];
      }
      return (task.labels || [])
        .map((labelId) => boardLabels.find((l) => l.id === labelId))
        .filter(Boolean);
    }, [task.labels, boardLabels]);

    useEffect(() => {
      if (isExpanded) {
        setEditedText(task.text);
        // Focus textarea when expanded
        setTimeout(() => textInputRef.current?.focus(), 100);
      }
    }, [isExpanded, task.text]);

    useEffect(() => {
      if (isEditingDate && dateInputRef.current) {
        dateInputRef.current.focus();
      }
    }, [isEditingDate]);

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

    const overdue =
      task.dueDate && task.status !== "done" && isOverdue(task.dueDate);
    const displayDate = task.dueDate ? formatDate(task.dueDate) : null;
    const dateStatus = task.dueDate ? getDueDateStatus(task.dueDate) : null;

    let dateTitle = "Click to set due date";
    if (displayDate) {
      dateTitle = overdue ? `Overdue! (${displayDate})` : `Due ${displayDate}`;
    }

    // Determine pill style based on dateStatus
    const getPillStyles = (status) => {
      switch (status) {
        case "overdue":
          return {
            bg: "var(--cartoon-secondary)",
            text: "var(--cartoon-text-light)",
            label: "Past Due",
          };
        case "today":
          return {
            bg: "var(--cartoon-accent)",
            text: "var(--cartoon-border-dark)",
            label: "Due Today",
          };
        case "tomorrow":
          return {
            bg: "var(--cartoon-primary)",
            text: "var(--cartoon-text-light)",
            label: "Due Tomorrow",
          };
        case "upcoming":
          return {
            bg: "var(--cartoon-green)",
            text: "var(--cartoon-text-light)",
            label: "Upcoming",
          };
        default:
          return null;
      }
    };

    const pillStyles = dateStatus ? getPillStyles(dateStatus) : null;

    // Helper function to convert DD-MM-YY to YYYY-MM-DD for HTML date input
    const convertToInputFormat = (ddmmyy) => {
      if (!ddmmyy) return "";
      try {
        const [day, month, year] = ddmmyy.split("-");
        const fullYear = 2000 + parseInt(year, 10);
        return `${fullYear}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      } catch (e) {
        console.error("Error converting date to input format:", ddmmyy, e);
        return "";
      }
    };

    // Helper function to convert YYYY-MM-DD to DD-MM-YY for app storage
    const convertFromInputFormat = (yyyymmdd) => {
      if (!yyyymmdd) return null;
      try {
        const [year, month, day] = yyyymmdd.split("-");
        const shortYear = parseInt(year, 10) - 2000;
        return `${day.padStart(2, "0")}-${month.padStart(2, "0")}-${shortYear
          .toString()
          .padStart(2, "0")}`;
      } catch (e) {
        console.error("Error converting date from input format:", yyyymmdd, e);
        return null;
      }
    };

    const handleDateChange = (e) => setCurrentDueDate(e.target.value);

    const handleExpandClick = (e) => {
      // Prevent expansion if clicking on a button or the date editor itself
      if (e.target.closest("button, input, textarea")) {
        return;
      }
      onExpand();
    };

    const internalHandleDateClick = (e) => {
      e.stopPropagation();
      // Convert DD-MM-YY to YYYY-MM-DD for the date input
      setCurrentDueDate(convertToInputFormat(task.dueDate || ""));
      setIsEditingDate(true);
    };

    const internalSaveDate = () => {
      // Convert YYYY-MM-DD back to DD-MM-YY for app storage
      const newDate = convertFromInputFormat(currentDueDate);
      if (task && newDate !== task.dueDate) {
        onUpdateTaskDueDate(task.id, newDate);
      }
      setIsEditingDate(false);
    };

    const internalHandleDateBlur = () => {
      internalSaveDate();
    };

    const internalHandleDateKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        internalSaveDate();
      } else if (e.key === "Escape") {
        setIsEditingDate(false);
        // Reset to original value in input format
        setCurrentDueDate(convertToInputFormat(task?.dueDate || ""));
      }
    };

    const handleDeleteClick = (e) => {
      e.stopPropagation();
      onDeleteTask(task.id);
    };

    const handleSave = () => {
      if (editedText.trim() !== task.text) {
        onUpdateTask(task.id, { text: editedText.trim() });
      }
      onExpand(); // Collapse the card
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
        <div className="flex justify-between items-start mb-2 gap-2">
          {isExpanded ? (
            <textarea
              ref={textInputRef}
              className="input-base w-full text-sm flex-grow"
              style={{
                minHeight: "60px", // Ensure it has some height
                resize: "none", // Don't allow user resizing
              }}
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              onClick={(e) => e.stopPropagation()} // Prevent card click-away
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSave();
                } else if (e.key === "Escape") {
                  onExpand(); // Collapse card
                }
              }}
            />
          ) : (
            <span
              className="task-card-text text-xs leading-snug break-words flex-grow"
              style={{ color: "var(--cartoon-text)", fontWeight: 400 }}
            >
              {task.text}
            </span>
          )}
          <button
            // Small circular action button for delete
            className="w-5 h-5 p-0 flex items-center justify-center rounded-full border-2 border-solid bg-white shadow-[1.5px_1.5px_0px_var(--cartoon-border-dark)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[0.5px_0.5px_0px_var(--cartoon-border-dark)] active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-none transition-all duration-100 ease-in-out flex-shrink-0"
            style={{
              borderColor: "var(--cartoon-border-dark)",
              color: "var(--cartoon-secondary)",
            }}
            title="Delete task"
            onClick={handleDeleteClick}
          >
            <span className="text-lg leading-none font-bold">&times;</span>
          </button>
        </div>
        <div className="task-card-bottom-row flex items-center flex-wrap gap-2 min-h-[24px] mt-auto">
          <div className="task-card-date-container flex items-center">
            {isEditingDate ? (
              <input
                ref={dateInputRef}
                type="date"
                value={currentDueDate}
                onChange={handleDateChange}
                onBlur={internalHandleDateBlur}
                onKeyDown={internalHandleDateKeyDown}
                onClick={(e) => e.stopPropagation()}
                // Mini cartoon date input
                className="p-1 text-xs w-auto inline-block border-2 rounded-md outline-none"
                style={{
                  fontFamily: "var(--cartoon-font)",
                  borderColor: "var(--cartoon-border-dark)",
                  backgroundColor: "white",
                  color: "var(--cartoon-text)",
                  boxShadow: "1px 1px 0px var(--cartoon-shadow-color)", // Subtle shadow for tiny input
                }}
              />
            ) : (
              <>
                <div
                  className={`task-card-date text-xs inline-flex items-center cursor-pointer p-0.5 rounded-md hover:bg-cartoon-bg-medium`}
                  style={{
                    fontFamily: "var(--cartoon-font)",
                    color: task.dueDate
                      ? overdue
                        ? "var(--cartoon-secondary)"
                        : "var(--cartoon-text)"
                      : "var(--cartoon-border-medium)",
                    fontWeight: task.dueDate && overdue ? 700 : 400,
                  }}
                  title={dateTitle}
                  onClick={internalHandleDateClick}
                >
                  <span
                    className={`task-card-date-icon mr-1.5 text-sm ${
                      task.dueDate && overdue
                        ? "text-[var(--cartoon-secondary)]"
                        : "text-[var(--cartoon-text)]"
                    }`}
                  >
                    📅
                  </span>
                  <span className="task-card-date-text">
                    {displayDate ? displayDate : "Set Due Date"}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Display Area for Pills (Date and Labels) */}
          <div className="flex items-center flex-wrap gap-2">
            {pillStyles && (
              <div
                className="task-date-pill text-xs px-2 py-0.5 rounded-full border-2 font-bold inline-flex items-center justify-center"
                style={{
                  backgroundColor: pillStyles.bg,
                  color: pillStyles.text,
                  borderColor: "var(--cartoon-border-dark)",
                  boxShadow: "1px 1px 0px var(--cartoon-border-dark)",
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
                  color: "var(--cartoon-text-light)", // Assuming light text on colored backgrounds
                  borderColor: "var(--cartoon-border-dark)",
                  boxShadow: "1px 1px 0px var(--cartoon-border-dark)",
                }}
              >
                {label.name}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: "12px" }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-visible"
              onClick={(e) => e.stopPropagation()} // Prevent card click-away from closing it
            >
              <div
                className="flex justify-between items-end gap-2 pt-3 border-t-2 border-dashed mt-3"
                style={{ borderColor: "var(--cartoon-border-medium)" }}
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
          )}
        </AnimatePresence>
      </div>
    );
  }
);
export default TaskCard;
