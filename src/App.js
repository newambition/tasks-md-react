// src/App.jsx
import React, { useEffect, Suspense, lazy, useState, useMemo } from "react";
import { initializeConfetti } from "./utils/confetti";
import { DEFAULT_BOARD_NAME } from "./constants";
import SplashScreen from "./components/SplashScreen";
import { getDueDateStatus } from "./utils/helpers";
import { useKanbanManager } from "./hooks/useKanbanManager";
const Header = lazy(() => import("./components/Header"));
const KanbanBoard = lazy(() => import("./components/KanbanBoard"));
const Sidebar = lazy(() => import("./components/Sidebar"));

const LoadingFallback = () => (
  <div
    className="flex items-center justify-center min-h-screen"
    style={{ backgroundColor: "var(--bg-primary)" }}
  >
    {/* Minimal content, or even just the background, to reduce flash */}
  </div>
);

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLabelIds, setSelectedLabelIds] = useState([]);
  const [dueDateFilter, setDueDateFilter] = useState(null); // e.g., 'today', 'overdue'
  const [sidebarOpen, setSidebarOpen] = useState(true); // Sidebar state
  // isAppReady is useful for effects that depend on the main structure being mounted,
  // but not strictly necessary for this fix if conditional rendering is correct.
  // const [isAppReady, setIsAppReady] = useState(false);

  const {
    state,
    activeBoard, // This will be null if boards.length === 0, or the active/first board object
    tasksForDisplay,
    actions,
  } = useKanbanManager();

  const filteredTasks = useMemo(() => {
    let tasks = tasksForDisplay;

    // Filter by search term
    if (searchTerm) {
      tasks = tasks.filter((task) =>
        task.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selected labels
    if (selectedLabelIds.length > 0) {
      tasks = tasks.filter(
        (task) =>
          task.labels &&
          task.labels.some((labelId) => selectedLabelIds.includes(labelId))
      );
    }

    // Filter by due date status
    if (dueDateFilter) {
      tasks = tasks.filter((task) => {
        const status = getDueDateStatus(task.dueDate);
        return status === dueDateFilter;
      });
    }

    return tasks;
  }, [tasksForDisplay, searchTerm, selectedLabelIds, dueDateFilter]);

  const { boards, activeBoardId, activePhaseId } = state;

  useEffect(() => {
    initializeConfetti();
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 3000); // Assuming splash screen duration is intentional

    return () => clearTimeout(splashTimer);
  }, []);

  // This effect should ideally only run if activeBoardId truly needs to change,
  // not just because the 'boards' array reference changed.
  // Adding a check for 'showSplash' ensures it doesn't run prematurely.
  useEffect(() => {
    if (
      !showSplash &&
      boards.length > 0 &&
      !boards.some((b) => b.id === activeBoardId)
    ) {
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
      <>
        <canvas
          id="confetti-canvas"
          className="fixed inset-0 w-full h-screen pointer-events-none z-[5000]"
        ></canvas>
        <div className="flex h-screen">
          {/* Sidebar */}
          <Suspense
            fallback={<div className="w-16 bg-[var(--bg-secondary)]"></div>}
          >
            <Sidebar
              isOpen={sidebarOpen}
              onToggle={() => setSidebarOpen(!sidebarOpen)}
              boards={boards}
              activeBoard={null}
              activeBoardPhases={[]}
              activePhaseId={null}
              onAddBoard={actions.addBoard}
              onSelectBoard={actions.selectBoard}
              onRenameBoard={actions.renameBoard}
              onDeleteBoard={actions.deleteBoard}
              onSelectPhase={actions.selectPhase}
              onAddPhase={actions.addPhaseToActiveBoard}
              onRenamePhase={actions.renamePhaseOnActiveBoard}
              onDeletePhase={actions.deletePhaseFromActiveBoard}
            />
          </Suspense>

          {/* Main Content */}
          <div className="flex flex-col flex-1 overflow-hidden">
            <Suspense fallback={<LoadingFallback />}>
              <Header
                // Remove board/phase related props - they're now in the sidebar
                tasks={[]}
                onLoadMarkdown={actions.loadMarkdownDataToActiveBoard}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                // Filter props
                boardLabels={[]}
                selectedLabelIds={selectedLabelIds}
                onSelectedLabelIdsChange={setSelectedLabelIds}
                dueDateFilter={dueDateFilter}
                onDueDateFilterChange={setDueDateFilter}
              />
            </Suspense>
            <div className="flex flex-col items-center justify-center flex-1 p-4 text-center">
              <h1 className="text-2xl font-extrabold mb-4 text-text-primary">
                No Boards Available
              </h1>
              <p className="mb-6 text-text-secondary">
                Create a new board to get started.
              </p>
              <button
                onClick={() => actions.addBoard(DEFAULT_BOARD_NAME)}
                className="btn btn-primary px-6 py-3 text-base"
              >
                + Create Default Board
              </button>
            </div>
          </div>
        </div>
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
      <canvas
        id="confetti-canvas"
        className="fixed inset-0 w-full h-screen pointer-events-none z-[5000]"
      ></canvas>
      <div className="flex h-screen">
        {/* Sidebar */}
        <Suspense
          fallback={<div className="w-16 bg-[var(--bg-secondary)]"></div>}
        >
          <Sidebar
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
            boards={boards}
            activeBoard={activeBoard}
            activeBoardPhases={activeBoard.phases || []}
            activePhaseId={activePhaseId}
            onAddBoard={actions.addBoard}
            onSelectBoard={actions.selectBoard}
            onRenameBoard={actions.renameBoard}
            onDeleteBoard={actions.deleteBoard}
            onSelectPhase={actions.selectPhase}
            onAddPhase={actions.addPhaseToActiveBoard}
            onRenamePhase={actions.renamePhaseOnActiveBoard}
            onDeletePhase={actions.deletePhaseFromActiveBoard}
          />
        </Suspense>

        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <Suspense fallback={<LoadingFallback />}>
            <Header
              // Remove board/phase related props - they're now in the sidebar
              tasks={tasksForDisplay}
              onLoadMarkdown={actions.loadMarkdownDataToActiveBoard}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              // Filter props
              boardLabels={activeBoard?.labels || []}
              selectedLabelIds={selectedLabelIds}
              onSelectedLabelIdsChange={setSelectedLabelIds}
              dueDateFilter={dueDateFilter}
              onDueDateFilterChange={setDueDateFilter}
            />
          </Suspense>

          {/* Kanban Board */}
          <div className="flex-1 overflow-hidden">
            <Suspense fallback={<LoadingFallback />}>
              <KanbanBoard
                key={`${activeBoard.id}-${activePhaseId}`}
                tasks={filteredTasks}
                setTasks={actions.setTasksForActiveBoard}
                onDeleteTask={actions.deleteTask}
                onUpdateTaskDueDate={actions.updateTaskDueDate}
                onUpdateTask={actions.updateTask}
                addTaskToBoardColumn={actions.addTaskToBoardColumn}
                // Label-related props
                boardLabels={activeBoard.labels || []}
                onCreateLabel={actions.createLabel}
                onUpdateLabel={actions.updateLabel}
                onDeleteLabel={actions.deleteLabel}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
export default App;
