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
        isDragging,
    } = useSortable({
        id: id,
        data: {
            type: 'task',
            task,
            columnIdOrigin: task.status,
        }
    });

    const liftScale = 1.03; // Slightly reduced scale for a more subtle lift

    // Base style from useSortable, we will add to this or override
    const sortableStyle = {
        transform: CSS.Transform.toString(transform),
        transition: transition || `transform 250ms ease, box-shadow 200ms ease, opacity 200ms ease-out`, // Added box-shadow to transition
        fontFamily: 'var(--cartoon-font)', // Ensure cartoon font is applied
    };

    let combinedStyle = { ...sortableStyle };
    let cardClasses = `card-base p-4 flex flex-col justify-between touch-manipulation`; // Using p-4 for 1rem

    if (isDraggingOverlay) {
        combinedStyle = {
            ...combinedStyle,
            opacity: 0.9,
            cursor: 'grabbing',
            zIndex: 9999,
            minHeight: '90px', // Min height for consistency
            transform: `scale(${liftScale}) rotate(-1deg)`, // Apply scale and slight rotate
            boxShadow: '8px 8px 0px var(--cartoon-shadow-color)', // Prominent cartoon shadow
        };
    } else if (isDragging) {
        combinedStyle = {
            ...combinedStyle,
            opacity: 0.85,
            cursor: 'grabbing',
            zIndex: 9999,
            minHeight: '90px',
            // Apply scale from useSortable's transform, add rotation and stronger shadow
            transform: CSS.Transform.toString(transform ? { ...transform, scaleX: liftScale, scaleY: liftScale, rotate: '-1deg' } : { scaleX: liftScale, scaleY: liftScale, rotate: '-1deg' }),
            boxShadow: '7px 7px 0px var(--cartoon-shadow-color)', // Hover-like shadow when dragging
        };
        // Remove hover effects from card-base if isDragging to prevent conflict
        cardClasses = cardClasses.replace("hover:transform", "").replace("hover:translate-x-[-2px]", "").replace("hover:translate-y-[-2px]", "").replace("hover:rotate-[-1deg]", "").replace("hover:shadow-[6px_6px_0px_var(--cartoon-shadow-color)]", "");

    } else {
         // Default state, rely on .card-base for shadow and hover effects
        combinedStyle = {
            ...combinedStyle,
            minHeight: '90px', // Consistent min height
            cursor: 'grab',
        };
    }


    useEffect(() => {
        if (isEditingDate && dateInputRef.current) {
            dateInputRef.current.focus();
        }
    }, [isEditingDate]);

    if (!task || !task.id) {
        return <div className="card-base p-4 text-cartoon-secondary border-cartoon-secondary shadow-[4px_4px_0px_var(--cartoon-secondary)] h-[90px]">Invalid Task Data (ID missing)</div>;
    }
    if (!columnId && !task.status) {
         return <div className="card-base p-4 text-cartoon-secondary border-cartoon-secondary shadow-[4px_4px_0px_var(--cartoon-secondary)] h-[90px]">Invalid Task Data (Status missing)</div>;
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
            style={combinedStyle}
            className={cardClasses}
            data-task-id={task.id}
            {...attributes}
            {...listeners}
        >
            <div className="flex justify-between items-start mb-2 gap-2">
                <span className="task-card-text text-sm leading-snug break-words flex-grow" style={{color: 'var(--cartoon-text)', fontWeight: 400}}>
                    {task.text}
                </span>
                <button
                    // Small circular action button for delete
                    className="w-7 h-7 p-0 flex items-center justify-center rounded-full border-2 border-solid bg-white shadow-[1.5px_1.5px_0px_var(--cartoon-border-dark)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[0.5px_0.5px_0px_var(--cartoon-border-dark)] active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-none transition-all duration-100 ease-in-out flex-shrink-0"
                    style={{ borderColor: 'var(--cartoon-border-dark)', color: 'var(--cartoon-secondary)'}}
                    title="Delete task"
                    onClick={handleDeleteClick}
                >
                    <span className="text-lg leading-none font-bold">&times;</span>
                </button>
            </div>
            <div className="task-card-date-container flex items-center gap-1 min-h-[24px] mt-auto"> {/* Increased min-height slightly */}
                {isEditingDate ? (
                    <input
                        ref={dateInputRef} type="date" value={currentDueDate}
                        onChange={handleDateChange} 
                        onBlur={internalHandleDateBlur}
                        onKeyDown={internalHandleDateKeyDown}
                        onClick={(e) => e.stopPropagation()}
                        // Mini cartoon date input
                        className="p-1 text-xs w-auto inline-block border-2 rounded-md outline-none"
                        style={{
                            fontFamily: 'var(--cartoon-font)',
                            borderColor: 'var(--cartoon-border-dark)',
                            backgroundColor: 'white',
                            color: 'var(--cartoon-text)',
                            boxShadow: '1px 1px 0px var(--cartoon-shadow-color)', // Subtle shadow for tiny input
                        }}
                    />
                ) : (
                    <div
                        className={`task-card-date text-xs inline-flex items-center cursor-pointer p-0.5 rounded-md hover:bg-cartoon-bg-medium`}
                        style={{
                            fontFamily: 'var(--cartoon-font)',
                            color: task.dueDate ? (overdue ? 'var(--cartoon-secondary)' : 'var(--cartoon-text)') 
                                                : 'var(--cartoon-border-medium)',
                            fontWeight: task.dueDate && overdue ? 700 : 400,
                        }}
                        title={dateTitle} onClick={internalHandleDateClick}
                    >
                        <span className={`task-card-date-icon mr-1.5 text-sm ${task.dueDate && overdue ? 'text-[var(--cartoon-secondary)]' : 'text-[var(--cartoon-text)]'}`}>📅</span>
                        <span className="task-card-date-text">{displayDate ? displayDate : 'Set Due Date'}</span>
                    </div>
                )}
            </div>
        </div>
    );
});
export default TaskCard;