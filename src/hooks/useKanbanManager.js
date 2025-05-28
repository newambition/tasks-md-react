// src/hooks/useKanbanManager.js
import { useReducer, useEffect, useCallback } from 'react';
import { kanbanReducer } from '../store/reducer';
import { initialState } from '../store/initialState'; // getInitialData removed from here
import * as actions from '../store/actionTypes';
import { KANBAN_DATA_STORAGE_KEY, COLUMN_IDS } from '../constants';
import { triggerConfetti as confettiEffect } from '../utils/confetti';


export const useKanbanManager = () => {
  const [state, dispatch] = useReducer(kanbanReducer, initialState);

  useEffect(() => {
    try {
      localStorage.setItem(KANBAN_DATA_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save kanban data to localStorage:", error);
    }
  }, [state]);

  // --- Board Actions ---
  const addBoard = useCallback((boardName) => {
    dispatch({ type: actions.ADD_BOARD, payload: { boardName } });
  }, []);

  const selectBoard = useCallback((boardId) => {
    dispatch({ type: actions.SELECT_BOARD, payload: { boardId } });
  }, []);

  const renameBoard = useCallback((boardId, newName) => {
    dispatch({ type: actions.RENAME_BOARD, payload: { boardId, newName } });
  }, []);

  const deleteBoard = useCallback((boardId) => {
    // Confirmation and board count check is now in the reducer for consistency,
    // but can also be kept here as a pre-dispatch check.
    // For this iteration, reducer handles the alert.
    if (window.confirm('Are you sure you want to delete this board and all its tasks?')) {
        dispatch({ type: actions.DELETE_BOARD, payload: { boardId } });
    }
  }, []);

  const loadMarkdownDataToActiveBoard = useCallback((markdownText) => {
    dispatch({ type: actions.LOAD_MARKDOWN_DATA, payload: { markdownText } });
    // Alert moved to reducer to be closer to state change, or can be a callback.
    // For now, reducer can't alert. So, alert here or hook returns status.
    // Keeping alert here for simplicity of this step.
    alert("Markdown data loaded into current board!");
  }, []);

  // --- Phase Actions ---
  const addPhaseToActiveBoard = useCallback((phaseName) => {
    dispatch({ type: actions.ADD_PHASE, payload: { phaseName } });
  }, []);

  const selectPhase = useCallback((phaseId) => {
    dispatch({ type: actions.SELECT_PHASE, payload: { phaseId } });
  }, []);

  const renamePhaseOnActiveBoard = useCallback((phaseId, newName) => {
    dispatch({ type: actions.RENAME_PHASE, payload: { phaseId, newName } });
  }, []);

  const deletePhaseFromActiveBoard = useCallback((phaseIdToDelete) => {
    // Last phase deletion check is now in the reducer.
    if (window.confirm('Are you sure you want to delete this phase? Tasks in this phase will become unphased.')) {
      dispatch({ type: actions.DELETE_PHASE, payload: { phaseIdToDelete } });
    }
  }, []);

  // --- Task Actions ---
  const updateTasksAndConfetti = useCallback((updaterFn) => {
    const activeBoardForConfetti = state.boards.find(b => b.id === state.activeBoardId);
    if (!activeBoardForConfetti) return;

    const originalTasks = activeBoardForConfetti.tasks;
    const newTasks = updaterFn(originalTasks); 

    originalTasks.forEach(originalTask => {
        const newTaskDetails = newTasks.find(t => t.id === originalTask.id);
        if (newTaskDetails && newTaskDetails.status === COLUMN_IDS[2] && originalTask.status !== COLUMN_IDS[2]) {
            confettiEffect();
        }
    });
    
    dispatch({ type: actions.SET_TASKS_FOR_ACTIVE_BOARD, payload: { tasksOrUpdater: newTasks } });

  }, [state.activeBoardId, state.boards]);


  const addTaskToBoardColumn = useCallback((taskText, columnStatus, customDueDate = null) => {
    dispatch({ type: actions.ADD_TASK_TO_COLUMN, payload: { taskText, columnStatus, customDueDate } });
  }, []);

  const deleteTask = useCallback((taskId) => {
    dispatch({ type: actions.DELETE_TASK, payload: { taskId } });
  }, []);

  const updateTaskDueDate = useCallback((taskId, newDueDate) => {
    dispatch({ type: actions.UPDATE_TASK_DUE_DATE, payload: { taskId, newDueDate } });
  }, []);


  // --- Derived State ---
  const activeBoard = state.boards.find(b => b.id === state.activeBoardId) || (state.boards.length > 0 ? state.boards[0] : null);
  
  const tasksForDisplay = useCallback(() => {
    if (!activeBoard || !state.activePhaseId) { // activePhaseId should always be set if board exists
        // If activeBoard has no phases (which we try to prevent), activePhaseId might be null from reducer.
        // In this scenario, no tasks are displayed for any specific phase.
        return [];
    }
    // Since "All Phases" is removed, activePhaseId should always be a valid ID.
    return activeBoard.tasks.filter(task => task.phaseId === state.activePhaseId);
  }, [activeBoard, state.activePhaseId])();


  return {
    state,
    activeBoard,
    tasksForDisplay,
    actions: {
      addBoard,
      selectBoard,
      renameBoard,
      deleteBoard,
      loadMarkdownDataToActiveBoard,
      addPhaseToActiveBoard,
      selectPhase,
      renamePhaseOnActiveBoard,
      deletePhaseFromActiveBoard,
      setTasksForActiveBoard: updateTasksAndConfetti,
      addTaskToBoardColumn,
      deleteTask,
      updateTaskDueDate,
    },
  };
};