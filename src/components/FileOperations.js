
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FaFolderOpen,
  FaSave,
  FaFileExport,
} from 'react-icons/fa';
import { exportContent } from '../utils/helpers';

const FileOperations = ({
  fileName,
  isApiSupported,
  onOpenFile,
  onSaveFile,
  onSaveFileAs,
  onLoadMarkdown,
  activeBoard,
}) => {
  const fileInputRef = useRef(null);

  return (
    <div className="border-t border-[var(--cartoon-border-dark)] pt-3">
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
                  a.download = `${activeBoard.name}-${new Date()
                    .toISOString()
                    .split("T")[0]}.md`;
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
  );
};

export default FileOperations;
