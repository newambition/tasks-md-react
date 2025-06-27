
import React, { Suspense } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Sidebar = React.lazy(() => import('./Sidebar'));
const Header = React.lazy(() => import('./Header'));
const KanbanBoard = React.lazy(() => import('./KanbanBoard'));

const LoadingFallback = () => (
  <div
    className="flex items-center justify-center min-h-screen"
    style={{ backgroundColor: 'var(--bg-primary)' }}
  ></div>
);

const SidebarToggle = ({ isOpen, onToggle }) => (
  <button
    onClick={onToggle}
    className={`fixed top-5 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-300 z-[9999] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--cartoon-bg-medium)]`}
    style={{
      left: isOpen ? '308px' : '8px',
      border: '2px solid var(--cartoon-border-dark)',
      boxShadow: '2px 2px 0px var(--cartoon-shadow-color)',
      fontFamily: 'var(--cartoon-font)',
    }}
    title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
  >
    {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
  </button>
);

const MainLayout = ({
  sidebarOpen,
  setSidebarOpen,
  boards,
  activeBoard,
  activePhaseId,
  actions,
  tasksForDisplay,
  handleOpenFile,
  handleSaveFile,
  handleSaveFileAs,
  fileName,
  isApiSupported,
  searchTerm,
  setSearchTerm,
  selectedLabelIds,
  setSelectedLabelIds,
  dueDateFilter,
  setDueDateFilter,
  filteredTasks,
}) => (
  <>
    <canvas
      id="confetti-canvas"
      className="fixed inset-0 w-full h-screen pointer-events-none z-[5000]"
    ></canvas>
    <SidebarToggle
      isOpen={sidebarOpen}
      onToggle={() => setSidebarOpen(!sidebarOpen)}
    />
    <div className="flex h-screen">
      <Suspense
        fallback={<div className="w-16 bg-[var(--bg-secondary)]"></div>}
      >
        <Sidebar
          isOpen={sidebarOpen}
          boards={boards}
          activeBoard={activeBoard}
          activePhaseId={activePhaseId}
          onAddBoard={actions.addBoard}
          onSelectBoard={actions.selectBoard}
          onRenameBoard={actions.renameBoard}
          onDeleteBoard={actions.deleteBoard}
          onSelectPhase={actions.selectPhase}
          onAddPhase={actions.addPhaseToActiveBoard}
          onRenamePhase={actions.renamePhaseOnActiveBoard}
          onDeletePhase={actions.deletePhaseFromActiveBoard}
          tasks={tasksForDisplay}
          onLoadMarkdown={actions.loadMarkdownDataToActiveBoard}
          onOpenFile={handleOpenFile}
          onSaveFile={handleSaveFile}
          onSaveFileAs={handleSaveFileAs}
          fileName={fileName}
          isApiSupported={isApiSupported}
        />
      </Suspense>

      <div className="flex flex-col flex-1 overflow-hidden">
        <Suspense fallback={<LoadingFallback />}>
          <Header
            tasks={tasksForDisplay}
            onLoadMarkdown={actions.loadMarkdownDataToActiveBoard}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            boardLabels={activeBoard?.labels || []}
            selectedLabelIds={selectedLabelIds}
            onSelectedLabelIdsChange={setSelectedLabelIds}
            dueDateFilter={dueDateFilter}
            onDueDateFilterChange={setDueDateFilter}
          />
        </Suspense>

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

export default MainLayout;
