import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { exportContent } from "../utils/helpers";

import { motion, AnimatePresence } from "framer-motion";
import {
  FaFolder,
  FaFolderOpen,
  FaSave,
  FaFileExport,
  FaFile,
  FaPlus,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

const Sidebar = ({
  isOpen,
  boards = [],
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
  tasks = [],
  onLoadMarkdown,
  onOpenFile,
  onSaveFile,
  onSaveFileAs,
  fileName,
  isApiSupported,
}) => {
  const { theme } = useTheme();
  const [expandedBoards, setExpandedBoards] = useState(new Set());
  const [editingBoardId, setEditingBoardId] = useState(null);
  const [editingPhaseId, setEditingPhaseId] = useState(null);
  const [editingBoardName, setEditingBoardName] = useState("");
  const [editingPhaseName, setEditingPhaseName] = useState("");
  const [isAddingNewSpace, setIsAddingNewSpace] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState("");
  const boardInputRef = useRef(null);
  const phaseInputRef = useRef(null);
  const newSpaceInputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-expand the active board
  useEffect(() => {
    if (activeBoard) {
      setExpandedBoards((prev) => new Set([...prev, activeBoard.id]));
    }
  }, [activeBoard]);

  // Focus inputs when editing starts
  useEffect(() => {
    if (editingBoardId && boardInputRef.current) {
      boardInputRef.current.focus();
      boardInputRef.current.select();
    }
  }, [editingBoardId]);

  useEffect(() => {
    if (editingPhaseId && phaseInputRef.current) {
      phaseInputRef.current.focus();
      phaseInputRef.current.select();
    }
  }, [editingPhaseId]);

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
    setNewSpaceName("");
  };

  const saveNewSpace = () => {
    if (newSpaceName.trim()) {
      onAddBoard(newSpaceName.trim());
    }
    setIsAddingNewSpace(false);
    setNewSpaceName("");
  };

  const cancelNewSpace = () => {
    setIsAddingNewSpace(false);
    setNewSpaceName("");
  };

  const handleNewSpaceKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveNewSpace();
    } else if (e.key === "Escape") {
      cancelNewSpace();
    }
  };

  const startEditingBoard = (board, e) => {
    e.stopPropagation();
    setEditingBoardId(board.id);
    setEditingBoardName(board.name);
  };

  const saveEditingBoard = () => {
    if (editingBoardName.trim() && editingBoardId) {
      onRenameBoard(editingBoardId, editingBoardName.trim());
    }
    setEditingBoardId(null);
    setEditingBoardName("");
  };

  const cancelEditingBoard = () => {
    setEditingBoardId(null);
    setEditingBoardName("");
  };

  const handleBoardKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveEditingBoard();
    } else if (e.key === "Escape") {
      cancelEditingBoard();
    }
  };

  const handleDeleteBoard = (boardId, e) => {
    e.stopPropagation();
    if (boards.length > 1) {
      onDeleteBoard(boardId);
    }
  };

  const handleAddPhase = (boardId, e) => {
    e.stopPropagation();
    if (activeBoard?.id === boardId) {
      const newPhaseName = prompt("Enter name for the new phase:");
      if (newPhaseName && newPhaseName.trim()) {
        onAddPhase(newPhaseName.trim());
      }
    }
  };

  const startEditingPhase = (phase, e) => {
    e.stopPropagation();
    setEditingPhaseId(phase.id);
    setEditingPhaseName(phase.name);
  };

  const saveEditingPhase = () => {
    if (editingPhaseName.trim() && editingPhaseId) {
      onRenamePhase(editingPhaseId, editingPhaseName.trim());
    }
    setEditingPhaseId(null);
    setEditingPhaseName("");
  };

  const cancelEditingPhase = () => {
    setEditingPhaseId(null);
    setEditingPhaseName("");
  };

  const handlePhaseKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveEditingPhase();
    } else if (e.key === "Escape") {
      cancelEditingPhase();
    }
  };

  const handleDeletePhase = (phaseId, e) => {
    e.stopPropagation();
    if (activeBoard.phases.length > 1) {
      onDeletePhase(phaseId);
    }
  };

  const sidebarWidth = isOpen ? "320px" : "20px";

  return (
    <motion.div
      initial={false}
      animate={{ width: sidebarWidth }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`h-full bg-[var(--bg-primary)] border-r-[2px] border-[var(--cartoon-border-dark)] flex flex-col overflow-hidden relative ${
        theme === "dark" ? "bg-[var(--bg-primary)]" : "bg-[var(--bg-primary)]"
      }`}
      style={{
        fontFamily: "var(--cartoon-font)",
      }}
    >
      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto p-2 flex flex-col">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="flex flex-col h-full"
            >
              {/* Boards Section */}
              <div className="flex-1 mb-4 mt-2">
                {/* Boards Section Header */}
                <div className="mb-4 py-2 px-4">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-lg font-black text-[var(--text-heading)] underline-offset-4  first-letter:underline uppercase tracking-wide`}
                    >
                      My Spaces
                    </span>
                  </div>
                </div>

                {/* Boards List */}
                <div className="space-y-2">
                  {boards.map((board) => {
                    const isExpanded = expandedBoards.has(board.id);
                    const isActive = activeBoard?.id === board.id;
                    const boardPhases = isActive ? activeBoard.phases : [];

                    return (
                      <div key={board.id} className="select-none">
                        {/* Board Item */}
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

                          {editingBoardId === board.id ? (
                            <input
                              ref={boardInputRef}
                              type="text"
                              value={editingBoardName}
                              onChange={(e) =>
                                setEditingBoardName(e.target.value)
                              }
                              onBlur={saveEditingBoard}
                              onKeyDown={handleBoardKeyDown}
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

                          {/* Board Actions */}
                          {!editingBoardId && (
                            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => startEditingBoard(board, e)}
                                className={`p-1 rounded hover:bg-black/10 text-xs mr-1 ${
                                  theme === "dark"
                                    ? "text-[var(--text-primary)]"
                                    : "text-[var(--text-primary)]"
                                }`}
                                title="Rename board"
                              >
                                <FaEdit />
                              </button>
                              {boards.length > 1 && (
                                <button
                                  onClick={(e) =>
                                    handleDeleteBoard(board.id, e)
                                  }
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

                        {/* Phases List */}
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
                                <div
                                  key={phase.id}
                                  className={`flex items-center p-1.5 rounded-md cursor-pointer group transition-all duration-150 ${
                                    activePhaseId === phase.id
                                      ? "bg-[var(--cartoon-accent)] text-[var(--button-secondary-text)]"
                                      : "hover:bg-[var(--cartoon-bg-light)] text-[var(--text-secondary)]"
                                  }`}
                                  onClick={() => onSelectPhase(phase.id)}
                                >
                                  <FaFile className="mr-3 text-xs" />

                                  {editingPhaseId === phase.id ? (
                                    <input
                                      ref={phaseInputRef}
                                      type="text"
                                      value={editingPhaseName}
                                      onChange={(e) =>
                                        setEditingPhaseName(e.target.value)
                                      }
                                      onBlur={saveEditingPhase}
                                      onKeyDown={handlePhaseKeyDown}
                                      className={`input-base text-sm py-1 px-2 flex-1 mr-2 ${
                                        theme === "dark"
                                          ? "text-[var(--text-primary)]"
                                          : "text-[var(--text-primary)]"
                                      }`}
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  ) : (
                                    <span
                                      className={`flex-1 truncate text-sm ${
                                        theme === "dark"
                                          ? "text-[var(--text-primary)]"
                                          : "text-[var(--text-primary)]"
                                      }`}
                                    >
                                      {phase.name}
                                    </span>
                                  )}

                                  {/* Phase Actions */}
                                  {!editingPhaseId && (
                                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button
                                        onClick={(e) =>
                                          startEditingPhase(phase, e)
                                        }
                                        className={`p-1 rounded hover:bg-black/10 text-xs mr-1 ${
                                          theme === "dark"
                                            ? "text-[var(--text-primary)]"
                                            : "text-[var(--text-primary)]"
                                        }`}
                                        title="Rename phase"
                                      >
                                        <FaEdit />
                                      </button>
                                      {boardPhases.length > 1 && (
                                        <button
                                          onClick={(e) =>
                                            handleDeletePhase(phase.id, e)
                                          }
                                          className={`p-1 rounded hover:bg-black/10 text-xs text-[var(--delete-btn-text)] ${
                                            theme === "dark"
                                              ? "text-[var(--delete-btn-text)]"
                                              : "text-[var(--delete-btn-text)]"
                                          }`}
                                          title="Delete phase"
                                        >
                                          <FaTrash />
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}

                              {/* Add Phase Button */}
                              <button
                                onClick={(e) => handleAddPhase(board.id, e)}
                                className="flex items-center w-full p-2.5 rounded-md text-[var(--cartoon-green)] hover:bg-[var(--cartoon-bg-light)] transition-colors text-sm"
                              >
                                <FaPlus className="mr-3 text-xs" />
                                Add Phase
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Add Phase Button for Active Board with No Phases */}
                        {isActive && isExpanded && boardPhases.length === 0 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="ml-8 mt-2"
                          >
                            <button
                              onClick={(e) => handleAddPhase(board.id, e)}
                              className="flex items-center w-full p-2.5 rounded-md text-[var(--cartoon-green)] hover:bg-[var(--cartoon-bg-light)] transition-colors text-sm"
                            >
                              <FaPlus className="mr-3 text-xs" />
                              Add First Phase
                            </button>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}

                  {/* Add New Space Button */}
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
                          theme === "dark"
                            ? "text-[var(--text-primary)]"
                            : "text-[var(--text-primary)]"
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
                        theme === "dark"
                          ? "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      }`}
                      title="Add new space"
                    >
                      <FaPlus className="mr-3 text-sm" />
                      <span className="font-medium">Add New Space</span>
                    </button>
                  )}
                </div>
              </div>

              {/* File Operations Section */}
              <div className="border-t border-[var(--cartoon-border-dark)] pt-3">
                {/* Display current file name if available */}
                {fileName && (
                  <div className="mb-3 px-2 text-xs text-[var(--text-secondary)]">
                    <span className="font-medium">Editing:</span>{" "}
                    <span className="text-[var(--text-primary)] font-semibold">
                      {fileName}
                    </span>
                  </div>
                )}

                <div className="space-y-2">
                  {isApiSupported ? (
                    <>
                      {/* File System Access API Buttons */}
                      <motion.button
                        onClick={onOpenFile}
                        className="btn btn-secondary px-3 py-2.5 text-sm cursor-pointer flex items-center gap-2 w-full"
                        title="Open a .MD file"
                      >
                        <FaFolderOpen className="text-sm" /> Open
                      </motion.button>

                      <motion.button
                        onClick={onSaveFile}
                        className="btn btn-primary px-3 py-2.5 text-sm cursor-pointer flex items-center gap-2 w-full"
                        title="Save changes to current file"
                      >
                        <FaSave className="text-sm" /> Save
                      </motion.button>

                      <motion.button
                        onClick={onSaveFileAs}
                        className="btn btn-secondary px-3 py-2.5 text-sm cursor-pointer flex items-center gap-2 w-full"
                        title="Save as new file"
                      >
                        <FaFileExport className="text-sm" /> Save As
                      </motion.button>
                    </>
                  ) : (
                    <>
                      {/* Fallback for unsupported browsers */}
                      <motion.label
                        htmlFor="md-upload"
                        className="btn btn-secondary px-3 py-2.5 text-sm cursor-pointer flex items-center gap-2 w-full"
                        title="Load tasks from .MD file into current board"
                      >
                        <FaFolderOpen className="text-sm" /> Load MD
                        <input
                          ref={fileInputRef}
                          type="file"
                          id="md-upload"
                          accept=".md"
                          className="hidden"
                          onChange={(event) => {
                            const file = event.target.files[0];
                            if (file) {
                              // Check file extension instead of MIME type (more reliable for .md files)
                              const fileName = file.name.toLowerCase();
                              if (
                                fileName.endsWith(".md") ||
                                fileName.endsWith(".markdown")
                              ) {
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                  try {
                                    const content = e.target.result;
                                    console.log(
                                      "File loaded successfully:",
                                      fileName
                                    );
                                    onLoadMarkdown(content);
                                  } catch (error) {
                                    console.error(
                                      "Error processing file content:",
                                      error
                                    );
                                  }
                                };
                                reader.onerror = (error) => {
                                  console.error("Error reading file:", error);
                                };
                                reader.readAsText(file);
                              } else {
                                console.warn(
                                  "Please select a valid Markdown (.md) file."
                                );
                                alert(
                                  "Please select a valid Markdown (.md) file."
                                );
                              }
                            }
                            event.target.value = "";
                          }}
                        />
                      </motion.label>

                      <motion.button
                        onClick={() => {
                          try {
                            if (!activeBoard) {
                              console.warn("No active board to export");
                              return;
                            }
                            const content = exportContent(activeBoard);
                            const blob = new Blob([content], {
                              type: "text/markdown",
                            });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = `${activeBoard.name}-${
                              new Date().toISOString().split("T")[0]
                            }.md`;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                          } catch (error) {
                            console.error("Error exporting markdown:", error);
                          }
                        }}
                        className="btn btn-secondary px-3 py-2.5 text-sm cursor-pointer flex items-center gap-2 w-full"
                        title="Export current board to .MD file"
                      >
                        <FaFileExport className="text-sm" /> Export MD
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Sidebar;
