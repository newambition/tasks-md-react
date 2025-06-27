import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFolder,
  FaFolderOpen,
  FaPlus,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { useEditableItem } from "./useEditableItem";
import PhaseItem from "./PhaseItem";

const BoardItem = ({
  board,
  isActive,
  isExpanded,
  toggleBoardExpansion,
  onSelectBoard,
  onRenameBoard,
  onDeleteBoard,
  onSelectPhase,
  onAddPhase,
  onRenamePhase,
  onDeletePhase,
  boardsLength,
  activeBoard,
  activePhaseId,
}) => {
  const { theme } = useTheme();
  const {
    isEditing,
    itemName,
    setItemName,
    inputRef,
    startEditing,
    saveEditing,
    handleKeyDown,
  } = useEditableItem(board.name, (newName) =>
    onRenameBoard(board.id, newName)
  );

  const boardPhases = isActive ? activeBoard.phases : [];

  const handleAddPhase = (e) => {
    e.stopPropagation();
    if (isActive) {
      const newPhaseName = prompt("Enter name for the new phase:");
      if (newPhaseName && newPhaseName.trim()) {
        onAddPhase(newPhaseName.trim());
      }
    }
  };

  return (
    <div key={board.id} className="select-none">
      <div
        className={`flex items-center p-2 rounded-lg cursor-pointer group transition-all duration-150 ${
          isActive
            ? "bg-[var(--cartoon-primary)] text-[var(--text-inverted)]"
            : `hover:bg-[var(--cartoon-bg-medium)] ${
                theme === "dark"
                  ? "text-[var(--text-primary)]"
                  : "text-[var(--text-primary)]"
              }`
        }`}
        onClick={() => {
          if (!isActive) {
            onSelectBoard(board.id);
          }
          toggleBoardExpansion(board.id);
        }}
      >
        <button
          className={`mr-3 p-1 rounded hover:bg-black/10 ${
            theme === "dark"
              ? "text-[var(--text-primary)]"
              : "text-[var(--text-primary)]"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            toggleBoardExpansion(board.id);
          }}
        >
          {isExpanded ? (
            <FaFolderOpen className="text-sm" />
          ) : (
            <FaFolder className="text-sm" />
          )}
        </button>

        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            onBlur={saveEditing}
            onKeyDown={handleKeyDown}
            className={`input-base text-sm py-1 px-2 flex-1 mr-2 ${
              theme === "dark"
                ? "text-[var(--text-primary)]"
                : "text-[var(--text-primary)]"
            }`}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span
            className={`flex-1 truncate text-sm font-semibold ${
              theme === "dark"
                ? "text-[var(--text-primary)]"
                : "text-[var(--text-primary)]"
            }`}
          >
            {board.name}
          </span>
        )}

        {!isEditing && (
          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => startEditing(e)}
              className={`p-1 rounded hover:bg-black/10 text-xs mr-1 ${
                theme === "dark"
                  ? "text-[var(--text-primary)]"
                  : "text-[var(--text-primary)]"
              }`}
              title="Rename board"
            >
              <FaEdit />
            </button>
            {boardsLength > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteBoard(board.id);
                }}
                className={`p-1 rounded hover:bg-black/10 text-xs text-[var(--delete-btn-text)] ${
                  theme === "dark"
                    ? "text-[var(--delete-btn-text)]"
                    : "text-[var(--delete-btn-text)]"
                }`}
                title="Delete board"
              >
                <FaTrash />
              </button>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isExpanded && boardPhases.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="ml-8 mt-2 space-y-1.5 overflow-hidden"
          >
            {boardPhases.map((phase) => (
              <PhaseItem
                key={phase.id}
                phase={phase}
                activePhaseId={activePhaseId}
                onSelectPhase={onSelectPhase}
                onRenamePhase={onRenamePhase}
                onDeletePhase={onDeletePhase}
                boardPhasesLength={boardPhases.length}
              />
            ))}

            <button
              onClick={handleAddPhase}
              className="flex items-center w-full p-2.5 rounded-md text-[var(--cartoon-green)] hover:bg-[var(--cartoon-bg-light)] transition-colors text-sm"
            >
              <FaPlus className="mr-3 text-xs" />
              Add Phase
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {isActive && isExpanded && boardPhases.length === 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="ml-8 mt-2"
        >
          <button
            onClick={handleAddPhase}
            className="flex items-center w-full p-2.5 rounded-md text-[var(--cartoon-green)] hover:bg-[var(--cartoon-bg-light)] transition-colors text-sm"
          >
            <FaPlus className="mr-3 text-xs" />
            Add First Phase
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default BoardItem;
