
import React from 'react';
import { FaFile, FaEdit, FaTrash } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { useEditableItem } from './useEditableItem';

const PhaseItem = ({
  phase,
  activePhaseId,
  onSelectPhase,
  onRenamePhase,
  onDeletePhase,
  boardPhasesLength,
}) => {
  const { theme } = useTheme();
  const { isEditing, itemName, setItemName, inputRef, startEditing, saveEditing, handleKeyDown } = useEditableItem(phase.name, (newName) => onRenamePhase(phase.id, newName));

  return (
    <div
      className={`flex items-center p-1.5 rounded-md cursor-pointer group transition-all duration-150 ${
        activePhaseId === phase.id
          ? 'bg-[var(--cartoon-accent)] text-[var(--button-secondary-text)]'
          : 'hover:bg-[var(--cartoon-bg-light)] text-[var(--text-secondary)]'
      }`}
      onClick={() => onSelectPhase(phase.id)}
    >
      <FaFile className="mr-3 text-xs" />

      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          onBlur={saveEditing}
          onKeyDown={handleKeyDown}
          className={`input-base text-sm py-1 px-2 flex-1 mr-2 ${
            theme === 'dark'
              ? 'text-[var(--text-primary)]'
              : 'text-[var(--text-primary)]'
          }`}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span
          className={`flex-1 truncate text-sm ${
            theme === 'dark'
              ? 'text-[var(--text-primary)]'
              : 'text-[var(--text-primary)]'
          }`}
        >
          {phase.name}
        </span>
      )}

      {!isEditing && (
        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => startEditing(e)}
            className={`p-1 rounded hover:bg-black/10 text-xs mr-1 ${
              theme === 'dark'
                ? 'text-[var(--text-primary)]'
                : 'text-[var(--text-primary)]'
            }`}
            title="Rename phase"
          >
            <FaEdit />
          </button>
          {boardPhasesLength > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeletePhase(phase.id);
              }}
              className={`p-1 rounded hover:bg-black/10 text-xs text-[var(--delete-btn-text)] ${
                theme === 'dark'
                  ? 'text-[var(--delete-btn-text)]'
                  : 'text-[var(--delete-btn-text)]'
              }`}
              title="Delete phase"
            >
              <FaTrash />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PhaseItem;
