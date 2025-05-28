// src/components/KanbanBoard.jsx
import React, { useMemo, useState } from 'react';
import {
    DndContext,
    closestCorners, // Can still be useful, or closestCenter
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    // For sortable, these are helpful for drag end logic:
    // Over, Active from dnd-kit/core
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable'; // arrayMove from sortable

import Column from './Column';
import TaskCard from './TaskCard';
import { COLUMN_IDS } from '../constants';

// arrayMove is now imported or can be defined here if not exporting from sortable directly for some reason
// function arrayMove(array, from, to) { ... } // Already defined in previous step, now imported

const KanbanBoard = ({
  tasks = [], // Full list of tasks for the current board/phase
  setTasks,   // The main state updater from useKanbanManager
  onDeleteTask,
  onUpdateTaskDueDate,
  addTaskToBoardColumn
}) => {
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
    );

    const columnConfig = useMemo(() => [
        { id: COLUMN_IDS[0], title: 'To Do', headerClass: 'header-todo', status: COLUMN_IDS[0] },
        { id: COLUMN_IDS[1], title: 'In Progress', headerClass: 'header-inprogress', status: COLUMN_IDS[1] },
        { id: COLUMN_IDS[2], title: 'Done', headerClass: 'header-done', status: COLUMN_IDS[2] },
    ], []);

    const columnIds = useMemo(() => columnConfig.map(col => col.id), [columnConfig]);

    // tasksByColumn is still useful for passing filtered tasks to each Column's SortableContext
    const tasksByColumn = useMemo(() => {
        return columnIds.reduce((acc, columnId) => {
            acc[columnId] = Array.isArray(tasks) ? tasks.filter(task => task && task.status === columnId) : [];
            return acc;
        }, {});
    }, [tasks, columnIds]);

    const [activeTaskId, setActiveTaskId] = useState(null);
    const activeTaskForOverlay = useMemo(() => tasks.find(t => t.id === activeTaskId), [activeTaskId, tasks]);


    const handleDragStart = (event) => {
        setActiveTaskId(event.active.id);
    };
    

    const handleDragEnd = (event) => {
        setActiveTaskId(null);
        const { active, over } = event;

        if (!active || !over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId && !columnIds.includes(overId)) return; // No change if dropped on self (not a column)

        setTasks(currentBoardTasks => {
            let newTasks = [...currentBoardTasks];
            const oldTaskIndexInFullList = newTasks.findIndex(t => t.id === activeId);
            if (oldTaskIndexInFullList === -1) return currentBoardTasks;

            const activeTaskData = newTasks[oldTaskIndexInFullList];
            
            // active.data.current.sortable.containerId is the ID of the SortableContext (columnId)
            const activeContainerId = active.data.current?.sortable?.containerId;
            // over.data.current?.sortable?.containerId is for an item, over.id is for a column
            const overContainerId = over.data.current?.sortable?.containerId || (columnIds.includes(overId) ? overId : null);

            if (!activeContainerId || !overContainerId) {
                // This can happen if dragging from non-sortable or to non-droppable.
                // Fallback to previous logic or log an error. For now, try to proceed.
                console.warn("DND: Missing container ID for active or over item.", active, over);
                // Attempt basic column drop if overId is a column
                if (columnIds.includes(overId) && activeTaskData.status !== overId) {
                    const taskToMove = { ...activeTaskData, status: overId };
                    newTasks.splice(oldTaskIndexInFullList, 1); // Remove from old
                     // Append to new column (simplified, no specific order within new column)
                    let lastIndexOfTarget = -1;
                    for (let i = newTasks.length - 1; i >= 0; i--) {
                        if (newTasks[i].status === overId) { lastIndexOfTarget = i; break; }
                    }
                    if (lastIndexOfTarget !== -1) newTasks.splice(lastIndexOfTarget + 1, 0, taskToMove);
                    else newTasks.push(taskToMove); // Add to end if column was empty or becomes first
                    return newTasks;
                }
                return currentBoardTasks; // No clear action
            }


            if (activeContainerId === overContainerId) {
                // Reordering within the same column
                // `active.id` and `over.id` are task IDs (or `over.id` could be column if dropped on empty space in same column)
                // The `SortableContext` handles the visual reordering.
                // We need to update the main `tasks` array to reflect this.

                // Find indices within the full list
                const overTaskIndexInFullList = newTasks.findIndex(t => t.id === overId);

                if (overTaskIndexInFullList !== -1) {
                    newTasks = arrayMove(newTasks, oldTaskIndexInFullList, overTaskIndexInFullList);
                } else if (columnIds.includes(overId) && overId === activeContainerId) {
                    // Dropped on the column itself (empty space) within the same column context.
                    // Move to the end of this column's tasks in the full list.
                    const [item] = newTasks.splice(oldTaskIndexInFullList, 1);
                    let insertAtIndex = newTasks.length;
                    let lastIndexOfThisColumn = -1;
                    for (let i = newTasks.length - 1; i >= 0; i--) {
                        if (newTasks[i].status === activeContainerId) {
                            lastIndexOfThisColumn = i;
                            break;
                        }
                    }
                    if (lastIndexOfThisColumn !== -1) insertAtIndex = lastIndexOfThisColumn + 1;
                    else { // Column became empty, or was always empty except for this task
                        const columnOrder = COLUMN_IDS;
                        const targetColOrderIdx = columnOrder.indexOf(activeContainerId);
                        let firstTaskOfNextCol = newTasks.length;
                        for(let i=0; i < newTasks.length; i++) {
                            if(columnOrder.indexOf(newTasks[i].status) > targetColOrderIdx) {
                                firstTaskOfNextCol = i;
                                break;
                            }
                        }
                        insertAtIndex = firstTaskOfNextCol;
                    }
                    newTasks.splice(insertAtIndex, 0, item);
                }
                return newTasks;

            } else {
                // Moving to a different column (overContainerId is the new columnId)
                const taskToMove = { ...activeTaskData, status: overContainerId };
                newTasks.splice(oldTaskIndexInFullList, 1); // Remove from old position

                let newIndexInFullList;

                if (over.data.current?.sortable && over.data.current.sortable.containerId === overContainerId) {
                    // Dropped over a sortable item in the new column
                    // `over.id` is the ID of the task we are dropping on/before/after
                    const targetTaskInNewColIndex = newTasks.findIndex(t => t.id === over.id);
                     if (targetTaskInNewColIndex !== -1) {
                        newIndexInFullList = targetTaskInNewColIndex; // Insert before this task
                    } else { // Fallback: append to new column
                        newIndexInFullList = newTasks.length; // This needs refinement to place at end of *that column*
                         let lastIndexOfTarget = -1;
                        for (let i = newTasks.length - 1; i >= 0; i--) {
                            if (newTasks[i].status === overContainerId) { lastIndexOfTarget = i; break; }
                        }
                        newIndexInFullList = (lastIndexOfTarget !== -1) ? lastIndexOfTarget + 1 : newTasks.length;
                    }
                } else {
                    // Dropped on the column itself (empty space in new column)
                    // Append to the tasks of that new column
                    let lastIndexOfTarget = -1;
                    for (let i = newTasks.length - 1; i >= 0; i--) {
                        if (newTasks[i].status === overContainerId) {
                            lastIndexOfTarget = i;
                            break;
                        }
                    }
                    if (lastIndexOfTarget !== -1) {
                        newIndexInFullList = lastIndexOfTarget + 1;
                    } else { // New column is empty
                        const columnOrder = COLUMN_IDS;
                        const targetColOrderIdx = columnOrder.indexOf(overContainerId);
                        let firstTaskOfNextCol = newTasks.length;
                        for(let i=0; i < newTasks.length; i++) {
                             if(columnOrder.indexOf(newTasks[i].status) > targetColOrderIdx) {
                                firstTaskOfNextCol = i;
                                break;
                            }
                        }
                        newIndexInFullList = firstTaskOfNextCol;
                    }
                }
                newTasks.splice(newIndexInFullList, 0, taskToMove);
                return newTasks;
            }
        });
    };
    
    const handleDragCancel = () => {
        setActiveTaskId(null);
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            // onDragOver={handleDragOver} // Potentially add for live inter-column feedback
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            <main className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 p-4 md:p-6 flex-grow">
                {columnConfig.map(col => (
                    <Column
                        key={col.id}
                        id={col.id} 
                        columnId={col.id} // Used as ID for SortableContext and Droppable
                        title={col.title}
                        headerClass={col.headerClass}
                        tasks={tasksByColumn[col.id] || []} // Pass tasks for this specific column
                        onDeleteTask={onDeleteTask}
                        onUpdateTaskDueDate={onUpdateTaskDueDate}
                        addTaskToBoardColumn={addTaskToBoardColumn}
                    />
                ))}
            </main>
            <DragOverlay dropAnimation={null}>
                {activeTaskId && activeTaskForOverlay ? (
                    <TaskCard
                        isDraggingOverlay={true} // To apply specific styles to the overlay version
                        id={activeTaskForOverlay.id}
                        task={activeTaskForOverlay}
                        // The columnId for the overlay card is its current status for styling,
                        // but it doesn't participate in sortable context transforms.
                        columnId={activeTaskForOverlay.status} 
                        onDeleteTask={() => {}} // Overlay card is non-interactive
                        onUpdateTaskDueDate={() => {}}
                    />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};
export default KanbanBoard;