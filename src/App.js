// src/App.jsx
import React, { useEffect, Suspense, lazy, useState } from 'react';
import { useKanbanManager } from './hooks/useKanbanManager';
import { initializeConfetti } from './utils/confetti';
import { DEFAULT_BOARD_NAME } from './constants';
import SplashScreen from './components/SplashScreen';

const Header = lazy(() => import('./components/Header'));
const KanbanBoard = lazy(() => import('./components/KanbanBoard'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen" style={{backgroundColor: 'var(--bg-primary)'}}>
    {/* Minimal content, or even just the background, to reduce flash */}
  </div>
);

function App() {
  const [showSplash, setShowSplash] = useState(true);
  // isAppReady is useful for effects that depend on the main structure being mounted,
  // but not strictly necessary for this fix if conditional rendering is correct.
  // const [isAppReady, setIsAppReady] = useState(false);


  const {
    state,
    activeBoard, // This will be null if boards.length === 0, or the active/first board object
    tasksForDisplay,
    actions,
  } = useKanbanManager();

  const { boards, activeBoardId, activePhaseId } = state;

  useEffect(() => {
    initializeConfetti();
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 4200);

    return () => clearTimeout(splashTimer);
  }, []);

  // This effect should ideally only run if activeBoardId truly needs to change,
  // not just because the 'boards' array reference changed.
  // Adding a check for 'showSplash' ensures it doesn't run prematurely.
  useEffect(() => {
    if (!showSplash && boards.length > 0 && !boards.some(b => b.id === activeBoardId)) {
      actions.selectBoard(boards[0].id);
    }
  }, [boards, activeBoardId, actions, showSplash]);


  if (showSplash) {
    return <SplashScreen />;
  }

  // --- Simplified Rendering Logic ---

  // Case 1: No boards exist at all. Show the "No Boards" UI.
  if (boards.length === 0) {
    // activeBoard will be null here from useKanbanManager
    return (
      <> {/* Removed Suspense here as Header isn't the main content causing flashes if no boards */}
        <canvas id="confetti-canvas" className="fixed inset-0 w-full h-full pointer-events-none z-[5000]"></canvas>
        {/* Header can be loaded normally or lazy if its initial display here is too slow */}
        <Suspense fallback={<LoadingFallback/>}> {/* Suspense specifically for Header here if it's heavy */}
            <Header
            boards={boards} activeBoard={null} activeBoardPhases={[]} activePhaseId={null}
            onAddBoard={actions.addBoard} onSelectBoard={actions.selectBoard}
            onRenameBoard={actions.renameBoard} onDeleteBoard={actions.deleteBoard}
            onSelectPhase={actions.selectPhase} onLoadMarkdown={actions.loadMarkdownDataToActiveBoard}
            onAddPhase={actions.addPhaseToActiveBoard} onRenamePhase={actions.renamePhaseOnActiveBoard}
            onDeletePhase={actions.deletePhaseFromActiveBoard}
            />
        </Suspense>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] p-4 text-center">
          <h1 className="text-2xl font-bold mb-4 text-text-primary">No Boards Available</h1>
          <p className="mb-6 text-text-secondary">Create a new board to get started.</p>
          <button
            onClick={() => actions.addBoard(DEFAULT_BOARD_NAME)}
            className="btn btn-primary px-6 py-3 text-base"
          >
            + Create Default Board
          </button>
        </div>
        <footer className="text-center p-4 text-sm text-text-muted mt-auto">
          TaskMD Pro - Turn your markdown into a kanban board
        </footer>
      </>
    );
  }

  // Case 2: Boards exist, but activeBoard is somehow still null (e.g., initial load, race condition).
  // This should be a very brief state if useKanbanManager is working correctly.
  // The key here is that `KanbanBoard` itself should not be keyed with a potentially null `activeBoard.id`.
  if (!activeBoard) {
    // This implies boards.length > 0 but activeBoard is not yet resolved.
    // This should be rare and brief if useKanbanManager's derivation is synchronous.
    return <LoadingFallback />;
  }

  // Case 3: Boards exist AND activeBoard is resolved and available. Render the main app.
  return (
    <>
      <canvas id="confetti-canvas" className="fixed inset-0 w-full h-full pointer-events-none z-[5000]"></canvas>
      <Suspense fallback={<LoadingFallback />}>
        <Header
          boards={boards}
          activeBoard={activeBoard} // Now guaranteed to be an object
          activeBoardPhases={activeBoard.phases || []} // Safely access phases
          activePhaseId={activePhaseId}
          onAddBoard={actions.addBoard} onSelectBoard={actions.selectBoard}
          onRenameBoard={actions.renameBoard} onDeleteBoard={actions.deleteBoard}
          onSelectPhase={actions.selectPhase} onLoadMarkdown={actions.loadMarkdownDataToActiveBoard}
          onAddPhase={actions.addPhaseToActiveBoard} onRenamePhase={actions.renamePhaseOnActiveBoard}
          onDeletePhase={actions.deletePhaseFromActiveBoard}
        />
        {/* activeBoard is guaranteed to be non-null here, so activeBoard.id is safe */}
        <KanbanBoard
            key={`${activeBoard.id}-${activePhaseId}`}
            tasks={tasksForDisplay}
            setTasks={actions.setTasksForActiveBoard}
            onDeleteTask={actions.deleteTask}
            onUpdateTaskDueDate={actions.updateTaskDueDate}
            addTaskToBoardColumn={actions.addTaskToBoardColumn}
        />
        <footer className="text-center p-4 text-sm text-text-muted mt-auto">
            TaskMD Pro - Turn your markdown into a kanban board
        </footer>
      </Suspense>
    </>
  );
}
export default App;