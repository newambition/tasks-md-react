// src/App.jsx
import React, { useEffect, useState, useMemo, lazy, Suspense } from 'react';
import { initializeConfetti } from './utils/confetti';
import SplashScreen from './components/SplashScreen';
import { getDueDateStatus } from './utils/helpers';
import { useKanbanManager } from './hooks/useKanbanManager';
import { useFileSystem } from './hooks/useFileSystem';
import { AnimatePresence, motion } from 'framer-motion';

const MainLayout = lazy(() => import('./components/MainLayout'));
const NoBoards = lazy(() => import('./components/NoBoards'));

const LoadingFallback = () => (
  <div
    className="flex items-center justify-center min-h-screen"
    style={{ backgroundColor: 'var(--bg-primary)' }}
  ></div>
);

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLabelIds, setSelectedLabelIds] = useState([]);
  const [dueDateFilter, setDueDateFilter] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { state, activeBoard, tasksForDisplay, actions } = useKanbanManager();
  const { openFile, saveFile, saveFileAs, fileName, isApiSupported } = useFileSystem();

  const filteredTasks = useMemo(() => {
    let tasks = tasksForDisplay;
    if (searchTerm) {
      tasks = tasks.filter((task) =>
        task.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedLabelIds.length > 0) {
      tasks = tasks.filter(
        (task) =>
          task.labels &&
          task.labels.some((labelId) => selectedLabelIds.includes(labelId))
      );
    }
    if (dueDateFilter) {
      tasks = tasks.filter((task) => {
        const status = getDueDateStatus(task.dueDate);
        return status === dueDateFilter;
      });
    }
    return tasks;
  }, [tasksForDisplay, searchTerm, selectedLabelIds, dueDateFilter]);

  const handleOpenFile = async () => {
    const content = await openFile();
    if (content !== null) {
      actions.loadMarkdownDataToActiveBoard(content);
    }
  };

  const handleSaveFile = () => {
    if (activeBoard) {
      saveFile(activeBoard);
    }
  };

  const handleSaveFileAs = () => {
    if (activeBoard) {
      saveFileAs(activeBoard);
    }
  };

  useEffect(() => {
    initializeConfetti();
    const splashTimer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(splashTimer);
  }, []);

  useEffect(() => {
    if (
      !showSplash &&
      state.boards.length > 0 &&
      !state.boards.some((b) => b.id === state.activeBoardId)
    ) {
      actions.selectBoard(state.boards[0].id);
    }
  }, [state.boards, state.activeBoardId, actions, showSplash]);

  const appContentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, delay: 0.5 } },
  };

  return (
    <AnimatePresence mode="wait">
      {showSplash ? (
        <SplashScreen key="splash" />
      ) : (
        <motion.div
          key="app-content"
          initial="hidden"
          animate="visible"
          variants={appContentVariants}
          className="h-screen w-screen"
        >
          <Suspense fallback={<LoadingFallback />}>
            {!activeBoard ? (
              <NoBoards
                actions={actions}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                boards={state.boards}
                handleOpenFile={handleOpenFile}
                handleSaveFile={handleSaveFile}
                handleSaveFileAs={handleSaveFileAs}
                fileName={fileName}
                isApiSupported={isApiSupported}
              />
            ) : (
              <MainLayout
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                boards={state.boards}
                activeBoard={activeBoard}
                activePhaseId={state.activePhaseId}
                actions={actions}
                tasksForDisplay={tasksForDisplay}
                handleOpenFile={handleOpenFile}
                handleSaveFile={handleSaveFile}
                handleSaveFileAs={handleSaveFileAs}
                fileName={fileName}
                isApiSupported={isApiSupported}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedLabelIds={selectedLabelIds}
                setSelectedLabelIds={setSelectedLabelIds}
                dueDateFilter={dueDateFilter}
                setDueDateFilter={setDueDateFilter}
                filteredTasks={filteredTasks}
              />
            )}
          </Suspense>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;
