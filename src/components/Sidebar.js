import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { exportContent } from "../utils/helpers";

import { motion, AnimatePresence } from "framer-motion";
import {
  FaChevronLeft,
  FaChevronRight,
  FaFolder,
  FaFolderOpen,
  FaFile,
  FaPlus,
  FaEdit,
  FaTrash,
  FaDownload,
} from "react-icons/fa";

const Sidebar = ({
  isOpen,
  onToggle,
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
}) => {
  const { theme } = useTheme();
  const [expandedBoards, setExpandedBoards] = useState(new Set());
  const [editingBoardId, setEditingBoardId] = useState(null);
  const [editingPhaseId, setEditingPhaseId] = useState(null);
  const [editingBoardName, setEditingBoardName] = useState("");
  const [editingPhaseName, setEditingPhaseName] = useState("");
  const boardInputRef = useRef(null);
  const phaseInputRef = useRef(null);
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
    const newBoardName = prompt("Enter name for the new board:");
    if (newBoardName && newBoardName.trim()) {
      onAddBoard(newBoardName.trim());
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

  const internalHandleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/markdown") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        onLoadMarkdown(content);
      };
      reader.readAsText(file);
    } else {
      console.warn("Please select a valid Markdown (.md) file.");
    }
    event.target.value = "";
  };

  const handleExportMarkdown = () => {
    try {
      const content = exportContent(tasks);
      const blob = new Blob([content], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tasks-${new Date().toISOString().split("T")[0]}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting markdown:", error);
    }
  };

  const sidebarWidth = isOpen ? "320px" : "55px";

  return (
    <motion.div
      initial={false}
      animate={{ width: sidebarWidth }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`h-full bg-[var(--bg-primary)] border-r-[2px] border-[var(--cartoon-border-dark)] flex flex-col overflow-hidden ${
        theme === "dark" ? "bg-[var(--bg-primary)]" : "bg-[var(--bg-primary)]"
      }`}
      style={{
        fontFamily: "var(--cartoon-font)",
      }}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-4 py-3 mt-1">
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.h2
              key="title"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className={`text-lg font-bold text-[var(--text-heading)] ${
                theme === "dark"
                  ? "text-[var(--text-heading)]"
                  : "text-[var(--text-heading)]"
              }`}
            >
              Navigation
            </motion.h2>
          ) : null}
        </AnimatePresence>

        <button
          onClick={onToggle}
          className={`action-btn  text-sm ${
            theme === "dark"
              ? "text-[var(--text-primary)]"
              : "text-[var(--text-primary)]"
          }`}
          title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
        </button>
      </div>

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
              <div className="flex-1 mb-4">
                {/* Boards Section Header */}
                <div className="flex items-center justify-between mb-4 pb-2">
                  <span
                    className={`text-base font-bold text-[var(--text-heading)] uppercase tracking-wide ${
                      theme === "dark"
                        ? "text-[var(--text-heading)]"
                        : "text-[var(--text-heading)]"
                    }`}
                  >
                    My Spaces
                  </span>
                  <button
                    onClick={handleAddBoard}
                    className={`action-btn p-2 text-xs ${
                      theme === "dark"
                        ? "text-[var(--text-primary)]"
                        : "text-[var(--text-primary)]"
                    }`}
                    title="Add new board"
                  >
                    <FaPlus />
                  </button>
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
                          className={`flex items-center p-3 rounded-lg cursor-pointer group transition-all duration-150 ${
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
                                  className={`flex items-center p-2.5 rounded-md cursor-pointer group transition-all duration-150 ${
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
                </div>
              </div>

              {/* File Operations Section */}
              <div className="border-t border-[var(--cartoon-border-dark)] pt-3">
                <div className="space-y-2">
                  {/* Load MD Button */}
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
                      onChange={internalHandleFileChange}
                    />
                  </motion.label>

                  {/* Export MD Button */}
                  <motion.button
                    onClick={handleExportMarkdown}
                    className="btn btn-secondary px-3 py-2.5 text-sm cursor-pointer flex items-center gap-2 w-full"
                    title="Export current board to .MD file"
                  >
                    <FaDownload className="text-sm" /> Export MD
                  </motion.button>
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
