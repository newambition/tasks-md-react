
import React, { Suspense } from 'react';
import { DEFAULT_BOARD_NAME } from '../constants';

const Sidebar = React.lazy(() => import('./Sidebar'));

const NoBoards = ({
  actions,
  sidebarOpen,
  setSidebarOpen,
  boards,
  handleOpenFile,
  handleSaveFile,
  handleSaveFileAs,
  fileName,
  isApiSupported,
}) => (
  <>
    <canvas
      id="confetti-canvas"
      className="fixed inset-0 w-full h-screen pointer-events-none z-[5000]"
    ></canvas>
    <div className="flex h-screen">
      <Suspense
        fallback={<div className="w-16 bg-[var(--bg-secondary)]"></div>}
      >
        <Sidebar
          isOpen={sidebarOpen}
          boards={boards}
          activeBoard={null}
          activePhaseId={null}
          onAddBoard={actions.addBoard}
          onSelectBoard={actions.selectBoard}
          onRenameBoard={actions.renameBoard}
          onDeleteBoard={actions.deleteBoard}
          onSelectPhase={actions.selectPhase}
          onAddPhase={actions.addPhaseToActiveBoard}
          onRenamePhase={actions.renamePhaseOnActiveBoard}
          onDeletePhase={actions.deletePhaseFromActiveBoard}
          tasks={[]}
          onLoadMarkdown={actions.loadMarkdownDataToActiveBoard}
          onOpenFile={handleOpenFile}
          onSaveFile={handleSaveFile}
          onSaveFileAs={handleSaveFileAs}
          fileName={fileName}
          isApiSupported={isApiSupported}
        />
      </Suspense>

      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex flex-col items-center justify-center flex-1 p-4 text-center">
          <h1 className="text-2xl font-extrabold mb-4 text-text-primary">
            No Boards Available
          </h1>
          <p className="mb-6 text-text-secondary">
            Create a new Space to get started.
          </p>
          <button
            onClick={() => actions.addBoard(DEFAULT_BOARD_NAME)}
            className="btn btn-primary px-6 py-3 text-base"
          >
            + Create Default Space
          </button>
        </div>
      </div>
    </div>
  </>
);

export default NoBoards;
