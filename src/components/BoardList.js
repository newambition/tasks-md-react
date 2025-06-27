
import React, { useState, useEffect, useRef } from 'react';
import { FaPlus } from 'react-icons/fa';
import BoardItem from './BoardItem';
import { useTheme } from '../context/ThemeContext';

const BoardList = ({
  boards,
  activeBoard,
  activePhaseId,
  onAddBoard,
  onSelectBoard,
  onRenameBoard,
  onDeleteBoard,
  onSelectPhase,
  onAddPhase,
  onRenamePhase,
  onDeletePhase,
}) => {
  const { theme } = useTheme();
  const [expandedBoards, setExpandedBoards] = useState(new Set());
  const [isAddingNewSpace, setIsAddingNewSpace] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState('');
  const newSpaceInputRef = useRef(null);

  useEffect(() => {
    if (activeBoard) {
      setExpandedBoards((prev) => new Set([...prev, activeBoard.id]));
    }
  }, [activeBoard]);

  useEffect(() => {
    if (isAddingNewSpace && newSpaceInputRef.current) {
      newSpaceInputRef.current.focus();
    }
  }, [isAddingNewSpace]);

  const toggleBoardExpansion = (boardId) => {
    setExpandedBoards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(boardId)) {
        newSet.delete(boardId);
      } else {
        newSet.add(boardId);
      }
      return newSet;
    });
  };

  const handleAddBoard = () => {
    setIsAddingNewSpace(true);
    setNewSpaceName('');
  };

  const saveNewSpace = () => {
    if (newSpaceName.trim()) {
      onAddBoard(newSpaceName.trim());
    }
    setIsAddingNewSpace(false);
    setNewSpaceName('');
  };

  const cancelNewSpace = () => {
    setIsAddingNewSpace(false);
    setNewSpaceName('');
  };

  const handleNewSpaceKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveNewSpace();
    } else if (e.key === 'Escape') {
      cancelNewSpace();
    }
  };

  return (
    <div className="flex-1 mb-4 mt-2">
      <div className="mb-4 py-2 px-4">
        <div className="flex items-center justify-between">
          <span
            className={`text-lg font-black text-[var(--text-heading)] underline-offset-4  first-letter:underline uppercase tracking-wide`}
          >
            My Spaces
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {boards.map((board) => (
          <BoardItem
            key={board.id}
            board={board}
            isActive={activeBoard?.id === board.id}
            isExpanded={expandedBoards.has(board.id)}
            toggleBoardExpansion={toggleBoardExpansion}
            onSelectBoard={onSelectBoard}
            onRenameBoard={onRenameBoard}
            onDeleteBoard={onDeleteBoard}
            onSelectPhase={onSelectPhase}
            onAddPhase={onAddPhase}
            onRenamePhase={onRenamePhase}
            onDeletePhase={onDeletePhase}
            boardsLength={boards.length}
            activeBoard={activeBoard}
            activePhaseId={activePhaseId}
          />
        ))}

        {isAddingNewSpace ? (
          <div className="flex items-center w-full p-3 mt-3 rounded-lg border-2 border-dashed border-[var(--cartoon-border-dark)] hover:bg-[var(--cartoon-bg-light)] transition-colors text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            <input
              ref={newSpaceInputRef}
              type="text"
              value={newSpaceName}
              onChange={(e) => setNewSpaceName(e.target.value)}
              onBlur={saveNewSpace}
              onKeyDown={handleNewSpaceKeyDown}
              className={`input-base text-sm py-1 px-2 flex-1 mr-2 ${
                theme === 'dark'
                  ? 'text-[var(--text-primary)]'
                  : 'text-[var(--text-primary)]'
              }`}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={(e) => e.stopPropagation()}
              className="p-1 rounded hover:bg-black/10 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <FaPlus className="text-sm" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddBoard}
            className={`flex items-center w-full p-3 mt-3 rounded-lg border-2 border-dashed border-[var(--cartoon-border-dark)] hover:bg-[var(--cartoon-bg-light)] transition-colors text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] ${
              theme === 'dark'
                ? 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
            title="Add new space"
          >
            <FaPlus className="mr-3 text-sm" />
            <span className="font-medium">Add New Space</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default BoardList;
