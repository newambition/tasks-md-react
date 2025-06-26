// src/store/reducer.js
import {
  ADD_BOARD,
  SELECT_BOARD,
  RENAME_BOARD,
  DELETE_BOARD,
  LOAD_MARKDOWN_DATA,
  ADD_PHASE,
  SELECT_PHASE,
  RENAME_PHASE,
  DELETE_PHASE,
  SET_TASKS_FOR_ACTIVE_BOARD,
  ADD_TASK_TO_COLUMN,
  DELETE_TASK,
  UPDATE_TASK_DUE_DATE,
  SET_STATE_FROM_LOCALSTORAGE,
  UPDATE_TASK,
  CREATE_LABEL,
  UPDATE_LABEL,
  DELETE_LABEL,
} from "./actionTypes";
import { generateUniqueId } from "../utils/helpers";
import { parseMarkdown } from "../utils/markdownParser";
import { initialState as getInitialData } from "./initialState";

export const kanbanReducer = (state, action) => {
  switch (action.type) {
    case SET_STATE_FROM_LOCALSTORAGE:
      return action.payload || getInitialData(); // Use getInitialData to ensure structure

    case ADD_BOARD: {
      const newBoardId = generateUniqueId("board");
      const defaultPhaseId = generateUniqueId("phase");
      const newBoard = {
        id: newBoardId,
        name:
          action.payload.boardName.trim() || `Board ${state.boards.length + 1}`,
        phases: [{ id: defaultPhaseId, name: "General" }], // Always create with a default phase
        tasks: [],
      };
      return {
        ...state,
        boards: [...state.boards, newBoard],
        activeBoardId: newBoardId,
        activePhaseId: defaultPhaseId, // Select the default phase
      };
    }

    case SELECT_BOARD: {
      const boardToSelect = state.boards.find(
        (b) => b.id === action.payload.boardId
      );
      if (boardToSelect) {
        // Ensure the board has phases, then select the first one
        const firstPhaseId =
          boardToSelect.phases && boardToSelect.phases.length > 0
            ? boardToSelect.phases[0].id
            : null; // Should not be null due to board creation logic

        // If for some reason firstPhaseId is null, it means the board somehow has no phases.
        // This state should be avoided. The initialState and ADD_BOARD ensure phases.
        // If this happens, the UI in Header.js will need to handle "No phases" display.
        return {
          ...state,
          activeBoardId: action.payload.boardId,
          activePhaseId: firstPhaseId,
        };
      }
      return state;
    }

    case RENAME_BOARD: {
      // ... (no changes related to activePhaseId)
      if (!action.payload.newName.trim()) {
        alert("Board name cannot be empty.");
        return state;
      }
      return {
        ...state,
        boards: state.boards.map((b) =>
          b.id === action.payload.boardId
            ? { ...b, name: action.payload.newName.trim() }
            : b
        ),
      };
    }

    case DELETE_BOARD: {
      // ... (activePhaseId logic for new active board will be handled by subsequent SELECT_BOARD if necessary,
      // or better, directly determine the new activePhaseId here)
      if (state.boards.length <= 1) {
        alert("Cannot delete the last board.");
        return state;
      }
      const remainingBoards = state.boards.filter(
        (b) => b.id !== action.payload.boardId
      );
      let newActiveBoardId = state.activeBoardId;
      let newActivePhaseId = state.activePhaseId;

      if (state.activeBoardId === action.payload.boardId) {
        newActiveBoardId = remainingBoards[0]?.id || null;
        if (newActiveBoardId) {
          const newActiveBoardData = remainingBoards.find(
            (b) => b.id === newActiveBoardId
          );
          newActivePhaseId =
            newActiveBoardData?.phases && newActiveBoardData.phases.length > 0
              ? newActiveBoardData.phases[0].id
              : null;
        } else {
          newActivePhaseId = null; // No boards left, though this is prevented
        }
      }
      return {
        ...state,
        boards: remainingBoards,
        activeBoardId: newActiveBoardId,
        activePhaseId: newActivePhaseId,
      };
    }

    case LOAD_MARKDOWN_DATA: {
      if (!state.activeBoardId) {
        alert("No active board.");
        return state;
      }
      let {
        boards: parsedBoards,
        phases: parsedPhases,
        tasks: parsedTasks,
      } = parseMarkdown(action.payload.markdownText);
      let newActivePhaseId = null;
      let updatedBoardName = null;

      // If we have a board name from the markdown, use it
      if (parsedBoards && parsedBoards.length > 0) {
        updatedBoardName = parsedBoards[0].name; // Use the first board name found
      }

      if (parsedPhases.length > 0) {
        newActivePhaseId = parsedPhases[0].id;
      } else {
        // No phases parsed from markdown, create a default "General" phase
        const defaultPhaseId = generateUniqueId("phase");
        parsedPhases = [{ id: defaultPhaseId, name: "General" }];
        newActivePhaseId = defaultPhaseId;
        // Assign tasks to this default phase if they were unphased
        parsedTasks = parsedTasks.map((task) => ({
          ...task,
          phaseId: task.phaseId || newActivePhaseId,
        }));
      }

      // Process labels: extract unique labels from tasks and create board-level labels
      const currentBoard = state.boards.find(
        (b) => b.id === state.activeBoardId
      );
      const existingBoardLabels = currentBoard?.labels || [];
      const allBoardLabels = [...existingBoardLabels];
      const labelNameToIdMap = {};

      // Build a map of existing labels
      existingBoardLabels.forEach((label) => {
        labelNameToIdMap[`${label.name}-${label.color}`] = label.id;
      });

      // Process each task to extract and map labels
      parsedTasks = parsedTasks.map((task) => {
        const taskLabelIds = [];

        if (task.labels && Array.isArray(task.labels)) {
          task.labels.forEach((parsedLabel) => {
            const labelKey = `${parsedLabel.name}-${parsedLabel.color}`;

            // Check if this label already exists
            if (labelNameToIdMap[labelKey]) {
              taskLabelIds.push(labelNameToIdMap[labelKey]);
            } else {
              // Create new board-level label
              const newLabelId = generateUniqueId("label");
              const newBoardLabel = {
                id: newLabelId,
                name: parsedLabel.name,
                color: parsedLabel.color,
              };

              allBoardLabels.push(newBoardLabel);
              labelNameToIdMap[labelKey] = newLabelId;
              taskLabelIds.push(newLabelId);
            }
          });
        }

        return {
          ...task,
          labels: taskLabelIds, // Convert to array of label IDs
        };
      });

      return {
        ...state,
        boards: state.boards.map((b) =>
          b.id === state.activeBoardId
            ? {
                ...b,
                name: updatedBoardName || b.name, // Update board name if parsed from markdown
                phases: parsedPhases,
                tasks: parsedTasks,
                labels: allBoardLabels, // Update board labels
              }
            : b
        ),
        activePhaseId: newActivePhaseId,
      };
    }

    case ADD_PHASE: {
      if (!state.activeBoardId) {
        alert("No active board selected.");
        return state;
      }
      if (!action.payload.phaseName.trim()) {
        alert("Phase name cannot be empty.");
        return state;
      }
      const newPhase = {
        id: generateUniqueId("phase"),
        name: action.payload.phaseName.trim(),
      };
      let updatedActivePhaseId = state.activePhaseId;

      const newBoards = state.boards.map((board) => {
        if (board.id === state.activeBoardId) {
          const boardPhases = board.phases || [];
          // If this is the first phase being added to a board that had none
          if (boardPhases.length === 0) {
            updatedActivePhaseId = newPhase.id;
          }
          return { ...board, phases: [...boardPhases, newPhase] };
        }
        return board;
      });

      return {
        ...state,
        boards: newBoards,
        activePhaseId: updatedActivePhaseId, // Select the new phase if it's the first one
      };
    }

    case SELECT_PHASE: // This action assumes phaseId is valid for the current board
      return { ...state, activePhaseId: action.payload.phaseId };

    case RENAME_PHASE: {
      // ... (no changes related to activePhaseId selection)
      if (!state.activeBoardId) {
        alert("No active board selected.");
        return state;
      }
      if (!action.payload.newName.trim()) {
        alert("Phase name cannot be empty.");
        return state;
      }
      return {
        ...state,
        boards: state.boards.map((board) =>
          board.id === state.activeBoardId
            ? {
                ...board,
                phases: (board.phases || []).map((phase) =>
                  phase.id === action.payload.phaseId
                    ? { ...phase, name: action.payload.newName.trim() }
                    : phase
                ),
              }
            : board
        ),
      };
    }

    case DELETE_PHASE: {
      if (!state.activeBoardId) {
        alert("No active board selected.");
        return state;
      }

      let newActivePhaseId = state.activePhaseId;
      const boardIndex = state.boards.findIndex(
        (b) => b.id === state.activeBoardId
      );
      if (boardIndex === -1) return state;

      const currentBoard = state.boards[boardIndex];
      if (currentBoard.phases.length <= 1) {
        alert("Cannot delete the last phase of a board.");
        return state;
      }

      const newBoards = state.boards.map((board) => {
        if (board.id === state.activeBoardId) {
          const remainingPhases = (board.phases || []).filter(
            (phase) => phase.id !== action.payload.phaseIdToDelete
          );
          if (state.activePhaseId === action.payload.phaseIdToDelete) {
            newActivePhaseId =
              remainingPhases.length > 0 ? remainingPhases[0].id : null; // Default to first remaining
          }
          return {
            ...board,
            phases: remainingPhases,
            tasks: (board.tasks || []).map(
              (task) =>
                task.phaseId === action.payload.phaseIdToDelete
                  ? { ...task, phaseId: null }
                  : task // Unassign tasks from deleted phase
            ),
          };
        }
        return board;
      });

      // If after deletion, the active board has no phases (should be prevented by guard above),
      // we might need to add a default phase back. But the guard "cannot delete last phase" handles this.

      return {
        ...state,
        boards: newBoards,
        activePhaseId: newActivePhaseId,
      };
    }

    case SET_TASKS_FOR_ACTIVE_BOARD: {
      if (!state.activeBoardId) return state;
      return {
        ...state,
        boards: state.boards.map((board) => {
          if (board.id === state.activeBoardId) {
            const currentTasks = board.tasks || [];
            let updatedTasks =
              typeof action.payload.tasksOrUpdater === "function"
                ? action.payload.tasksOrUpdater(currentTasks)
                : action.payload.tasksOrUpdater;
            return { ...board, tasks: updatedTasks };
          }
          return board;
        }),
      };
    }

    case ADD_TASK_TO_COLUMN: {
      const { taskText, columnStatus, customDueDate } = action.payload;
      if (!state.activeBoardId) {
        alert("No active board selected.");
        return state;
      }

      const boardIndex = state.boards.findIndex(
        (b) => b.id === state.activeBoardId
      );
      if (boardIndex === -1) return state;

      let currentBoard = { ...state.boards[boardIndex] };
      currentBoard.phases = [...(currentBoard.phases || [])];
      currentBoard.tasks = [...(currentBoard.tasks || [])];

      let phaseForNewTask = state.activePhaseId;

      // Ensure activePhaseId is valid for the current board, or default.
      // This is crucial if a board somehow had no phases, or activePhaseId was stale.
      if (
        !phaseForNewTask ||
        !currentBoard.phases.some((p) => p.id === phaseForNewTask)
      ) {
        if (currentBoard.phases.length > 0) {
          phaseForNewTask = currentBoard.phases[0].id;
        } else {
          // This case implies a board with no phases. We should add one.
          const newDefaultPhaseId = generateUniqueId("phase");
          currentBoard.phases.push({ id: newDefaultPhaseId, name: "General" });
          phaseForNewTask = newDefaultPhaseId;
          // Since we modified currentBoard.phases, ensure state.activePhaseId reflects this for next render
          // This specific update to state.activePhaseId should happen in a more central place or via SELECT_PHASE action
        }
      }

      const newTask = {
        id: generateUniqueId("task"),
        phaseId: phaseForNewTask, // Use validated or new default phaseForNewTask
        text: taskText.trim(),
        status: columnStatus,
        dueDate: customDueDate || null,
        labels: [],
        labelColors: [],
      };
      currentBoard.tasks.push(newTask);

      const newBoardsArray = [...state.boards];
      newBoardsArray[boardIndex] = currentBoard;

      // If a new default phase was created because the board had none,
      // and the state.activePhaseId was not pointing to it, we need to update state.activePhaseId.
      // This is a bit tricky here. The selectPhase action or board selection logic should handle ensuring activePhaseId is always valid.
      // For adding a task, if activePhaseId was truly invalid for a board *with phases*, it should have defaulted earlier.
      // If the board had *no* phases, then phaseForNewTask now holds the ID of the *newly created* default phase.
      // In this scenario, state.activePhaseId for the entire app should also be updated to this new phase ID.
      let finalActivePhaseId = state.activePhaseId;
      if (
        currentBoard.phases.length === 1 &&
        currentBoard.phases[0].id === phaseForNewTask &&
        state.activePhaseId !== phaseForNewTask
      ) {
        finalActivePhaseId = phaseForNewTask;
      }

      return {
        ...state,
        boards: newBoardsArray,
        activePhaseId: finalActivePhaseId, // Update activePhaseId if a new default phase was created and selected for the task
      };
    }

    case DELETE_TASK: {
      if (!state.activeBoardId) return state;
      return {
        ...state,
        boards: state.boards.map((board) =>
          board.id === state.activeBoardId
            ? {
                ...board,
                tasks: (board.tasks || []).filter(
                  (task) => task.id !== action.payload.taskId
                ),
                labels: (board.labels || []).filter(
                  (label) => label.id !== action.payload.labelId
                ),
              }
            : board
        ),
      };
    }

    case UPDATE_TASK: {
      if (!state.activeBoardId) {
        return state;
      }
      return {
        ...state,
        boards: state.boards.map((board) =>
          board.id === state.activeBoardId
            ? {
                ...board,
                tasks: (board.tasks || []).map((task) =>
                  task.id === action.payload.taskId
                    ? { ...task, ...action.payload.updates }
                    : task
                ),
                labels: (board.labels || []).map((label) =>
                  label.id === action.payload.labelId
                    ? { ...label, ...action.payload.updates }
                    : label
                ),
              }
            : board
        ),
      };
    }

    case UPDATE_TASK_DUE_DATE: {
      if (!state.activeBoardId) return state;

      return {
        ...state,
        boards: state.boards.map((board) =>
          board.id === state.activeBoardId
            ? {
                ...board,
                tasks: (board.tasks || []).map((task) =>
                  task.id === action.payload.taskId
                    ? { ...task, dueDate: action.payload.newDueDate }
                    : task
                ),
              }
            : board
        ),
      };
    }

    // --- Label Actions ---
    case CREATE_LABEL: {
      if (!state.activeBoardId) return state;
      const { name, color } = action.payload;
      const newLabel = { id: generateUniqueId("label"), name, color };

      return {
        ...state,
        boards: state.boards.map((board) =>
          board.id === state.activeBoardId
            ? { ...board, labels: [...(board.labels || []), newLabel] }
            : board
        ),
      };
    }

    case UPDATE_LABEL: {
      if (!state.activeBoardId) return state;
      const { labelId, updates } = action.payload;

      return {
        ...state,
        boards: state.boards.map((board) =>
          board.id === state.activeBoardId
            ? {
                ...board,
                labels: (board.labels || []).map((label) =>
                  label.id === labelId ? { ...label, ...updates } : label
                ),
              }
            : board
        ),
      };
    }

    case DELETE_LABEL: {
      if (!state.activeBoardId) return state;
      const { labelId } = action.payload;

      return {
        ...state,
        boards: state.boards.map((board) => {
          if (board.id !== state.activeBoardId) return board;

          // Remove the label from the board's label list
          const updatedLabels = (board.labels || []).filter(
            (label) => label.id !== labelId
          );

          // Remove the label from all tasks on this board
          const updatedTasks = (board.tasks || []).map((task) => {
            if (task.labels && task.labels.includes(labelId)) {
              return {
                ...task,
                labels: task.labels.filter((id) => id !== labelId),
                labelColors: task.labelColors.filter(
                  (color) => color !== labelId
                ),
              };
            }
            return task;
          });

          return { ...board, labels: updatedLabels, tasks: updatedTasks };
        }),
      };
    }

    default:
      return state;
  }
};
