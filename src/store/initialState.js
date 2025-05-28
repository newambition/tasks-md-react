// src/store/initialState.js
import { generateUniqueId } from '../utils/helpers';
import { KANBAN_DATA_STORAGE_KEY, COLUMN_IDS, DEFAULT_BOARD_NAME } from '../constants';

const ensureBoardHasPhases = (board) => {
  if (!board.phases || board.phases.length === 0) {
    const defaultPhaseId = generateUniqueId('phase');
    board.phases = [{ id: defaultPhaseId, name: 'General' }];
    // If this board is active and has no active phase, set it.
    // This specific setting will be handled later when determining overall activePhaseId
  }
  return board;
};

export const getInitialData = () => {
  let loadedState = null;
  try {
    const storedData = localStorage.getItem(KANBAN_DATA_STORAGE_KEY);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (parsedData && Array.isArray(parsedData.boards)) {
        loadedState = {
          boards: parsedData.boards.map(board => {
            const normalizedBoard = {
              id: board.id || generateUniqueId('board'),
              name: board.name || DEFAULT_BOARD_NAME,
              phases: Array.isArray(board.phases)
                ? board.phases.map(p => ({ id: p.id || generateUniqueId('phase'), name: p.name || 'Unnamed Phase' }))
                : [], // Will be handled by ensureBoardHasPhases
              tasks: Array.isArray(board.tasks)
                ? board.tasks.filter(t => t && t.id && t.status && COLUMN_IDS.includes(t.status)).map(t => ({ ...t, phaseId: t.phaseId === undefined ? null : t.phaseId }))
                : [],
            };
            return ensureBoardHasPhases(normalizedBoard);
          }),
          activeBoardId: parsedData.activeBoardId,
          activePhaseId: parsedData.activePhaseId, // Will be validated below
        };
      }
    }
  } catch (error) {
    console.error("Failed to parse data from localStorage:", error);
    loadedState = null; // Fallback to default if parsing fails
  }

  if (!loadedState || loadedState.boards.length === 0) {
    // Default state if nothing in localStorage, parsing failed, or no boards
    const defaultBoardId = generateUniqueId('board');
    const defaultPhaseId = generateUniqueId('phase');
    return {
      boards: [
        {
          id: defaultBoardId,
          name: DEFAULT_BOARD_NAME,
          phases: [{ id: defaultPhaseId, name: 'General Tasks' }],
          tasks: [
            { id: generateUniqueId('task'), phaseId: defaultPhaseId, text: 'Sample task 1', status: 'todo', dueDate: null },
            { id: generateUniqueId('task'), phaseId: defaultPhaseId, text: 'Sample task 2', status: 'inprogress', dueDate: null },
          ],
        },
      ],
      activeBoardId: defaultBoardId,
      activePhaseId: defaultPhaseId, // Default to the first phase
    };
  }

  // Validate activeBoardId
  let activeBoard = loadedState.boards.find(b => b.id === loadedState.activeBoardId);
  if (!activeBoard && loadedState.boards.length > 0) {
    activeBoard = loadedState.boards[0];
    loadedState.activeBoardId = activeBoard.id;
  } else if (!activeBoard) {
    // This case should not be reached if the above "no boards" case is handled
    // but as a fallback, create a new default board configuration
    const defaultBoardId = generateUniqueId('board');
    const defaultPhaseId = generateUniqueId('phase');
    loadedState.boards = [{
        id: defaultBoardId, name: DEFAULT_BOARD_NAME, phases: [{ id: defaultPhaseId, name: 'General' }], tasks: []
    }];
    loadedState.activeBoardId = defaultBoardId;
    activeBoard = loadedState.boards[0];
    loadedState.activePhaseId = defaultPhaseId;
  }


  // Validate activePhaseId for the activeBoard
  // ensureBoardHasPhases would have already added a phase if 'phases' was missing or empty.
  if (activeBoard && activeBoard.phases.length > 0) {
    const phaseExists = activeBoard.phases.some(p => p.id === loadedState.activePhaseId);
    if (!phaseExists) {
      loadedState.activePhaseId = activeBoard.phases[0].id; // Default to first phase
    }
  } else if (activeBoard && activeBoard.phases.length === 0) {
    // This should ideally not happen if ensureBoardHasPhases worked correctly when board was processed.
    // However, if it does, create a default phase and select it.
    const defaultPhaseId = generateUniqueId('phase');
    activeBoard.phases = [{id: defaultPhaseId, name: 'General'}];
    loadedState.activePhaseId = defaultPhaseId;
  }


  return {
    boards: loadedState.boards,
    activeBoardId: loadedState.activeBoardId,
    activePhaseId: loadedState.activePhaseId,
  };
};

export const initialState = getInitialData();