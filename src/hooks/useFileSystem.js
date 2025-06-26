// src/hooks/useFileSystem.js
import { useState, useCallback } from "react";
import { exportContent } from "../utils/helpers"; // We'll reuse this

/**
 * Custom hook for interacting with the File System Access API.
 *
 * @returns {object} An object containing the file handle, file name,
 * and functions to open, save, and save-as files.
 */
export const useFileSystem = () => {
  const [fileHandle, setFileHandle] = useState(null);
  const [fileName, setFileName] = useState("");

  // Check for API support
  const isApiSupported = "showOpenFilePicker" in window;

  // Debug logging to help troubleshoot browser support
  console.log("File System Access API Support Check:", {
    hasShowOpenFilePicker: "showOpenFilePicker" in window,
    hasShowSaveFilePicker: "showSaveFilePicker" in window,
    userAgent: navigator.userAgent,
    isApiSupported,
  });

  /**
   * Opens a file picker and reads the content of the selected .md file.
   * @returns {Promise<string|null>} The content of the file or null if cancelled.
   */
  const openFile = useCallback(async () => {
    if (!isApiSupported) {
      alert("Your browser does not support the File System Access API.");
      return null;
    }

    try {
      const [handle] = await window.showOpenFilePicker({
        types: [
          {
            description: "Markdown Files",
            accept: { "text/markdown": [".md"] },
          },
        ],
      });

      const file = await handle.getFile();
      const content = await file.text();

      setFileHandle(handle);
      setFileName(file.name);
      return content;
    } catch (error) {
      // Handle cases where the user cancels the picker
      if (error.name === "AbortError") {
        return null;
      }
      console.error("Error opening file:", error);
      alert("An error occurred while opening the file.");
      return null;
    }
  }, [isApiSupported]);

  /**
   * Opens a "Save As" dialog and writes content to a new file.
   * @param {object} boardData - The board data to save.
   */
  const saveFileAs = useCallback(
    async (boardData) => {
      if (!isApiSupported) {
        alert("Your browser does not support the File System Access API.");
        return;
      }

      try {
        const handle = await window.showSaveFilePicker({
          types: [
            {
              description: "Markdown Files",
              accept: { "text/markdown": [".md"] },
            },
          ],
          suggestedName: "tasks.md",
        });

        const writable = await handle.createWritable();
        const markdownContent = exportContent(boardData);

        await writable.write(markdownContent);
        await writable.close();

        setFileHandle(handle);
        setFileName(handle.name);
        alert(`File saved as ${handle.name}`);
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }
        console.error("Error saving file as:", error);
        alert("An error occurred while saving the file.");
      }
    },
    [isApiSupported]
  );

  /**
   * Writes content to the currently held file handle. If no handle exists,
   * it calls saveFileAs.
   * @param {object} boardData - The board data to save.
   */
  const saveFile = useCallback(
    async (boardData) => {
      if (!fileHandle) {
        return saveFileAs(boardData);
      }

      try {
        const writable = await fileHandle.createWritable();
        const markdownContent = exportContent(boardData);

        await writable.write(markdownContent);
        await writable.close();
        alert(`Changes saved to ${fileName}`);
      } catch (error) {
        console.error("Error saving file:", error);
        alert("An error occurred while saving the file.");
      }
    },
    [fileHandle, fileName, saveFileAs]
  );

  return {
    openFile,
    saveFile,
    saveFileAs,
    fileName,
    fileHandle,
    isApiSupported,
  };
};
