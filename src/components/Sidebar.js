import React from "react";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import BoardList from "./BoardList";
import FileOperations from "./FileOperations";

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
  onLoadMarkdown,
  onOpenFile,
  onSaveFile,
  onSaveFileAs,
  fileName,
  isApiSupported,
}) => {
  const { theme } = useTheme();

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
              <BoardList
                boards={boards}
                activeBoard={activeBoard}
                activePhaseId={activePhaseId}
                onAddBoard={onAddBoard}
                onSelectBoard={onSelectBoard}
                onRenameBoard={onRenameBoard}
                onDeleteBoard={onDeleteBoard}
                onSelectPhase={onSelectPhase}
                onAddPhase={onAddPhase}
                onRenamePhase={onRenamePhase}
                onDeletePhase={onDeletePhase}
              />

              <FileOperations
                fileName={fileName}
                isApiSupported={isApiSupported}
                onOpenFile={onOpenFile}
                onSaveFile={onSaveFile}
                onSaveFileAs={onSaveFileAs}
                onLoadMarkdown={onLoadMarkdown}
                activeBoard={activeBoard}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Sidebar;
