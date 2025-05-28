// src/components/TaskCard.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { formatDate, isOverdue } from '../utils/helpers';

const TaskCard = React.memo(({ id, task = {}, columnId, onDeleteTask, onUpdateTaskDueDate, isDraggingOverlay = false }) => {
    const [isEditingDate, setIsEditingDate] = useState(false);
    const [currentDueDate, setCurrentDueDate] = useState(task?.dueDate || '');
    const dateInputRef = useRef(null);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging, // Key state for the "lift" effect
    } = useSortable({
        id: id,
        data: {
            type: 'task',
            task,
            columnIdOrigin: task.status,
        }
    });

    // Define the scale factor for when the card is "lifted" (being dragged)
    const liftScale = 1.05; // e.g., scale up by 5%

    const style = {
        // Apply the scale transform when isDragging is true
        // Combine with the existing transform from useSortable for movement
        transform: CSS.Transform.toString(transform ? { ...transform, scaleX: isDragging ? liftScale : 1, scaleY: isDragging ? liftScale : 1 } : null),
        transition: transition || `transform 250ms ease, opacity 200ms ease-out`, // Ensure transition includes transform
        opacity: isDragging ? 0.7 : 1, // Slightly more opaque when dragging the actual item
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: isDragging ? 9999 : 'auto',
        minHeight: '80px',
        boxShadow: isDragging ? '0 15px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.2)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', // Enhanced shadow when lifted
    };
    
    // Style for the card when it's rendered in the DragOverlay
    const overlayStyle = {
        opacity: 0.85, // Overlay can be slightly more opaque
        cursor: 'grabbing',
        zIndex: 9999,
        minHeight: '80px',
        transform: `scale(${liftScale})`, // Always scaled up in overlay
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)', // Prominent shadow for overlay
    };


    useEffect(() => {
        if (isEditingDate && dateInputRef.current) {
            dateInputRef.current.focus();
        }
    }, [isEditingDate]);

    if (!task || !task.id) {
        return <div className="p-3 rounded-md border border-red-500 bg-red-100 text-red-700 text-xs h-[80px]">Invalid Task Data (ID missing)</div>;
    }
    if (!columnId && !task.status) { // columnId is passed for context, task.status is source of truth
         return <div className="p-3 rounded-md border border-red-500 bg-red-100 text-red-700 text-xs h-[80px]">Invalid Task Data (Status missing)</div>;
    }

    const overdue = task.dueDate && task.status !== 'done' && isOverdue(task.dueDate);
    const displayDate = task.dueDate ? formatDate(task.dueDate) : null;
    let dateTitle = 'Click to set due date';
    if (displayDate) {
        dateTitle = overdue ? `Overdue! (${displayDate})` : `Due ${displayDate}`;
    }

    const handleDateChange = (e) => setCurrentDueDate(e.target.value);
    
    const internalHandleDateClick = (e) => {
        e.stopPropagation(); 
        setCurrentDueDate(task.dueDate || '');
        setIsEditingDate(true);
    };

    const internalSaveDate = () => {
        const newDate = currentDueDate || null;
        if (task && newDate !== task.dueDate) {
            onUpdateTaskDueDate(task.id, newDate);
        }
        setIsEditingDate(false);
    };

    const internalHandleDateBlur = () => {
        internalSaveDate(); 
    };

    const internalHandleDateKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            internalSaveDate();
        } else if (e.key === 'Escape') {
            setIsEditingDate(false);
            setCurrentDueDate(task?.dueDate || '');
        }
    };
    
    const handleDeleteClick = (e) => { e.stopPropagation(); onDeleteTask(task.id); };

    return (
        <div
            ref={setNodeRef}
            style={isDraggingOverlay ? overlayStyle : style}
            className={`task-card p-3 rounded-md border border-[var(--border-card)] bg-[var(--bg-secondary)] shadow-sm hover:shadow-xl flex flex-col justify-between touch-manipulation`}
            data-task-id={task.id}
            {...attributes}
            {...listeners}
        >
            <div className="flex justify-between items-start mb-2 gap-2">
                <span className="task-card-text text-sm text-[var(--text-heading)] leading-snug break-words flex-grow">
                    {task.text}
                </span>
                <button
                    className="delete-btn text-lg leading-none p-0 px-1 rounded-full text-[var(--delete-btn-text)] hover:text-[var(--delete-btn-hover-text)] hover:bg-[var(--delete-btn-hover-bg)] transition-colors duration-150 flex-shrink-0"
                    title="Delete task"
                    onClick={handleDeleteClick}
                >
                    ×
                </button>
            </div>
            <div className="task-card-date-container flex items-center gap-1 min-h-[20px] mt-auto">
                {isEditingDate ? (
                    <input
                        ref={dateInputRef} type="date" value={currentDueDate}
                        onChange={handleDateChange} 
                        onBlur={internalHandleDateBlur}
                        onKeyDown={internalHandleDateKeyDown}
                        onClick={(e) => e.stopPropagation()}
                        className="task-card-date-input input-base p-0 px-1 text-xs w-auto inline-block"
                        style={{ lineHeight: 'normal' }}
                    />
                ) : (
                    <div
                        className={`task-card-date text-xs inline-flex items-center cursor-pointer ${
                            task.dueDate ? (overdue ? 'text-[var(--overdue-text)] font-medium' : 'text-[var(--text-muted)]')
                                         : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] italic'
                        }`}
                        title={dateTitle} onClick={internalHandleDateClick}
                    >
                        <span className={`task-card-date-icon mr-1 text-xs ${task.dueDate && overdue ? 'text-[var(--overdue-icon)]' : 'text-[var(--text-secondary)]'}`}>📅</span>
                        <span className="task-card-date-text">{displayDate ? displayDate : 'Set Due Date'}</span>
                    </div>
                )}
            </div>
        </div>
    );
});
export default TaskCard;