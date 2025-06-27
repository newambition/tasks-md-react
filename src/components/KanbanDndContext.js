
import React, { useState, useMemo } from 'react';
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import { COLUMN_IDS } from '../constants';

const KanbanDndContext = ({
  children,
  tasks,
  setTasks,
  boardLabels,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const columnIds = useMemo(() => COLUMN_IDS, []);

  const [activeTaskId, setActiveTaskId] = useState(null);
  const activeTaskForOverlay = useMemo(
    () => tasks.find((t) => t.id === activeTaskId),
    [activeTaskId, tasks]
  );

  const handleDragStart = (event) => {
    setActiveTaskId(event.active.id);
  };

  const handleDragEnd = (event) => {
    setActiveTaskId(null);
    const { active, over } = event;

    if (!active || !over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId && !columnIds.includes(overId)) return;

    setTasks((currentBoardTasks) => {
      let newTasks = [...currentBoardTasks];
      const oldTaskIndexInFullList = newTasks.findIndex(
        (t) => t.id === activeId
      );
      if (oldTaskIndexInFullList === -1) return currentBoardTasks;

      const activeTaskData = newTasks[oldTaskIndexInFullList];

      const activeContainerId = active.data.current?.sortable?.containerId;
      const overContainerId =
        over.data.current?.sortable?.containerId ||
        (columnIds.includes(overId) ? overId : null);

      if (!activeContainerId || !overContainerId) {
        console.warn(
          "DND: Missing container ID for active or over item.",
          active,
          over
        );
        if (columnIds.includes(overId) && activeTaskData.status !== overId) {
          const taskToMove = { ...activeTaskData, status: overId };
          newTasks.splice(oldTaskIndexInFullList, 1);
          let lastIndexOfTarget = -1;
          for (let i = newTasks.length - 1; i >= 0; i--) {
            if (newTasks[i].status === overId) {
              lastIndexOfTarget = i;
              break;
            }
          }
          if (lastIndexOfTarget !== -1)
            newTasks.splice(lastIndexOfTarget + 1, 0, taskToMove);
          else newTasks.push(taskToMove);
          return newTasks;
        }
        return currentBoardTasks;
      }

      if (activeContainerId === overContainerId) {
        const overTaskIndexInFullList = newTasks.findIndex(
          (t) => t.id === overId
        );

        if (overTaskIndexInFullList !== -1) {
          newTasks = arrayMove(
            newTasks,
            oldTaskIndexInFullList,
            overTaskIndexInFullList
          );
        } else if (columnIds.includes(overId) && overId === activeContainerId) {
          const [item] = newTasks.splice(oldTaskIndexInFullList, 1);
          let insertAtIndex = newTasks.length;
          let lastIndexOfThisColumn = -1;
          for (let i = newTasks.length - 1; i >= 0; i--) {
            if (newTasks[i].status === activeContainerId) {
              lastIndexOfThisColumn = i;
              break;
            }
          }
          if (lastIndexOfThisColumn !== -1)
            insertAtIndex = lastIndexOfThisColumn + 1;
          else {
            const columnOrder = COLUMN_IDS;
            const targetColOrderIdx = columnOrder.indexOf(activeContainerId);
            let firstTaskOfNextCol = newTasks.length;
            for (let i = 0; i < newTasks.length; i++) {
              if (columnOrder.indexOf(newTasks[i].status) > targetColOrderIdx) {
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
        const taskToMove = { ...activeTaskData, status: overContainerId };
        newTasks.splice(oldTaskIndexInFullList, 1);

        let newIndexInFullList;

        if (
          over.data.current?.sortable &&
          over.data.current.sortable.containerId === overContainerId
        ) {
          const targetTaskInNewColIndex = newTasks.findIndex(
            (t) => t.id === over.id
          );
          if (targetTaskInNewColIndex !== -1) {
            newIndexInFullList = targetTaskInNewColIndex;
          } else {
            newIndexInFullList = newTasks.length;
            let lastIndexOfTarget = -1;
            for (let i = newTasks.length - 1; i >= 0; i--) {
              if (newTasks[i].status === overContainerId) {
                lastIndexOfTarget = i;
                break;
              }
            }
            newIndexInFullList =
              lastIndexOfTarget !== -1
                ? lastIndexOfTarget + 1
                : newTasks.length;
          }
        } else {
          let lastIndexOfTarget = -1;
          for (let i = newTasks.length - 1; i >= 0; i--) {
            if (newTasks[i].status === overContainerId) {
              lastIndexOfTarget = i;
              break;
            }
          }
          if (lastIndexOfTarget !== -1) {
            newIndexInFullList = lastIndexOfTarget + 1;
          } else {
            const columnOrder = COLUMN_IDS;
            const targetColOrderIdx = columnOrder.indexOf(overContainerId);
            let firstTaskOfNextCol = newTasks.length;
            for (let i = 0; i < newTasks.length; i++) {
              if (columnOrder.indexOf(newTasks[i].status) > targetColOrderIdx) {
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
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {children}
      <DragOverlay dropAnimation={null}>
        {activeTaskId && activeTaskForOverlay ? (
          <TaskCard
            isDraggingOverlay={true}
            id={activeTaskForOverlay.id}
            task={activeTaskForOverlay}
            columnId={activeTaskForOverlay.status}
            onDeleteTask={() => {}}
            onUpdateTaskDueDate={() => {}}
            onUpdateTask={() => {}}
            isExpanded={false}
            onExpand={() => {}}
            boardLabels={boardLabels}
            onCreateLabel={() => {}}
            onUpdateLabel={() => {}}
            onDeleteLabel={() => {}}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanDndContext;
