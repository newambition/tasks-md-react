// src/components/Column.jsx
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import { FaPlus } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// These variants were defined and should be used by the plus button
const plusButtonVariants = {
  hover: { scale: 1.15, rotate: 90, transition: { type: 'spring', stiffness: 400, damping: 10 } },
  tap: { scale: 0.9, rotate: 0 } // Corrected to rotate: 0 from rotate:0 for consistency
};

const formButtonVariants = {
  hover: { scale: 1.03, y: -1, transition: { duration: 0.15 } },
  tap: { scale: 0.97 }
};

const Column = React.memo(({
  id, columnId, title, headerClass, tasks = [],
  onDeleteTask, onUpdateTaskDueDate, addTaskToColumn
}) => {
    const { setNodeRef: setDroppableNodeRef, isOver: isOverColumn } = useDroppable({
         id: columnId,
         data: { type: 'column', columnId: columnId }
    });
    const [isAddingTask, setIsAddingTask] = React.useState(false);
    const [newTaskText, setNewTaskText] = React.useState('');
    const quickAddInputRef = React.useRef(null);

    React.useEffect(() => {
        if (isAddingTask && quickAddInputRef.current) quickAddInputRef.current.focus();
    }, [isAddingTask]);

    const handleOpenQuickAdd = () => setIsAddingTask(true);
    const handleCancelQuickAdd = () => { setNewTaskText(''); setIsAddingTask(false); };
    const handleQuickAddTask = () => {
        const trimmedText = newTaskText.trim();
        if (!trimmedText) { setNewTaskText(''); quickAddInputRef.current?.focus(); return; }
        if (typeof addTaskToColumn === 'function') addTaskToColumn(trimmedText, columnId, null);
        setNewTaskText(''); setIsAddingTask(false);
    };
    const handleQuickAddKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleQuickAddTask(); }
        else if (e.key === 'Escape') handleCancelQuickAdd();
    };
    
    const getButtonBgStyle = () => {
        if (headerClass.includes('todo')) return { backgroundColor: 'var(--header-todo-bg)'};
        if (headerClass.includes('inprogress')) return { backgroundColor: 'var(--header-inprogress-bg)'};
        if (headerClass.includes('done')) return { backgroundColor: 'var(--header-done-bg)'};
        // Fallback for plus button if no specific header class match (though it should always match one for a column)
        return { backgroundColor: 'var(--button-primary-bg)'}; // Or a neutral default
    };

    const taskIds = React.useMemo(() => tasks.map(task => task.id), [tasks]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease:"easeOut", delay: Math.random() * 0.15 }}
            ref={setDroppableNodeRef}
            className={`kanban-column flex flex-col rounded-lg shadow-xl border border-border-card transition-colors ${
                isOverColumn ? 'bg-[var(--drag-over-bg)] outline-1 outline-[var(--drag-over-outline)] outline-dashed -outline-offset-2' : 'bg-[var(--bg-tertiary)]'
            }`}
            style={{ minHeight: 'calc(100vh - 260px)', maxHeight: 'calc(100vh - 180px)' }}
        >
            <h2 className={`kanban-header ${headerClass} flex-shrink-0 rounded-t-lg sticky top-0 z-10`}>{title}</h2>
            <div className="task-list-container flex-grow p-3 md:p-4 overflow-y-auto">
                <SortableContext items={taskIds} strategy={verticalListSortingStrategy} id={columnId}>
                    <div className="task-list space-y-3">
                        {tasks.map((task) => {
                            if (!task || !task.id) { return null; }
                            return (
                                <TaskCard
                                    key={task.id}
                                    id={task.id}
                                    task={task}
                                    columnId={columnId} 
                                    onDeleteTask={onDeleteTask}
                                    onUpdateTaskDueDate={onUpdateTaskDueDate}
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
                            animate={{ opacity: 1, height: 'auto', marginTop: '0.75rem' }}
                            exit={{ opacity: 0, height: 0, marginTop: 0, transition: {duration: 0.2} }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="p-3 bg-[var(--bg-secondary)] rounded-md border border-[var(--border-card)] shadow-sm"
                        >
                            <textarea
                                ref={quickAddInputRef}
                                className="w-full p-2 text-sm border rounded border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter task description..."
                                value={newTaskText}
                                onChange={(e) => setNewTaskText(e.target.value)}
                                onKeyDown={handleQuickAddKeyDown}
                                rows="3"
                            />
                            <div className="flex justify-end mt-2 gap-2">
                                <motion.button variants={formButtonVariants} whileHover="hover" whileTap="tap" className="text-[var(--text-muted)] text-sm px-3 py-1 rounded hover:bg-[var(--bg-tertiary)] transition-colors" onClick={handleCancelQuickAdd}>Cancel</motion.button>
                                <motion.button variants={formButtonVariants} whileHover="hover" whileTap="tap" style={getButtonBgStyle()} className={`text-white text-sm px-3 py-1 rounded hover:opacity-90 transition-opacity`} onClick={handleQuickAddTask}>Add Task</motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!tasks.length && !isAddingTask && (
                     <div className={`p-3 rounded border-2 border-dashed border-[var(--border-color)] text-center text-sm text-[var(--text-muted)] italic opacity-75 mt-1 ${isOverColumn ? 'bg-opacity-50 bg-[var(--drag-over-bg)]' : ''}`}>
                        {isOverColumn ? `Drop task in ${title}` : `No tasks in ${title}.`}
                    </div>
                )}
            </div>
            {/* Add Task Button Section - Ensure motion.button is used here */}
            {!isAddingTask && (
                <div className="p-3 mt-auto flex justify-end flex-shrink-0 border-t border-border-color">
                    {/* Restored motion.button with variants and styling */}
                    <motion.button
                        variants={plusButtonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        style={getButtonBgStyle()} // Applies the column-specific background color
                        className={`w-8 h-8 flex items-center justify-center rounded-full text-white hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-tertiary)] focus:ring-current`}
                        onClick={handleOpenQuickAdd}
                        title={`Add task to ${title}`}
                    >
                        <FaPlus />
                    </motion.button>
                </div>
            )}
        </motion.div>
    );
});
export default Column;