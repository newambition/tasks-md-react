// src/utils/markdownParser.js
import { generateUniqueId } from "./helpers";

const DUE_DATE_REGEX = /\((\d{2}-\d{2}-\d{2})\)/; // Matches (DD-MM-YY)
const LABEL_REGEX = /\[([^\]]+)\]/g; // Matches all [label] or [label(#color)] patterns

/**
 * Parses labels from task text and returns cleaned text with labels data
 * Supports formats: [label] or [label(#color)]
 * @param {string} taskText - The task text that may contain labels
 * @returns {object} - { cleanText, labels: [{name, color}] }
 */
function parseLabels(taskText) {
  const labels = [];
  let cleanText = taskText;
  let match;

  // Reset regex lastIndex to ensure we start from the beginning
  LABEL_REGEX.lastIndex = 0;

  while ((match = LABEL_REGEX.exec(taskText)) !== null) {
    const fullMatch = match[0]; // Full [label(#color)] or [label]
    const labelContent = match[1]; // Content inside brackets

    // Check if label has color: label(#color)
    const colorMatch = labelContent.match(/^(.+)\(#([a-fA-F0-9]{6})\)$/);

    if (colorMatch) {
      // Label with color: [labelname(#ff0000)]
      labels.push({
        name: colorMatch[1].trim(),
        color: `#${colorMatch[2]}`,
      });
    } else {
      // Label without color: [labelname]
      labels.push({
        name: labelContent.trim(),
        color: "#4299e1", // Default blue color
      });
    }

    // Remove this label from the clean text
    cleanText = cleanText.replace(fullMatch, "");
  }

  // Collapse multiple spaces into one and trim whitespace
  cleanText = cleanText.replace(/\s\s+/g, ' ').trim();

  return { cleanText, labels };
}

export const parseMarkdown = (markdownContent) => {
  const lines = markdownContent.split("\n");
  const parsedBoards = [];
  const parsedPhases = [];
  const parsedTasks = [];
  let currentPhaseId = null;
  let phaseOrder = 0; // To maintain order if needed, though not strictly used in current board display
  let currentBoardId = null;
  // Create a default "Uncategorized" phase for tasks found before any ## Phase heading
  const defaultPhaseId = generateUniqueId("phase");
  let defaultPhaseAdded = false;

  lines.forEach((line) => {
    const trimmedLine = line.trim();

    // Match Board Name (# Board Name)
    if (trimmedLine.startsWith("# ")) {
      const boardName = trimmedLine.substring(2).trim();
      if (boardName) {
        currentBoardId = generateUniqueId("board");
        parsedBoards.push({
          id: currentBoardId,
          name: boardName,
        });
      }
    }

    // Match Phase Headers (## Phase Name)
    if (trimmedLine.startsWith("## ")) {
      const phaseName = trimmedLine.substring(3).trim();
      if (phaseName) {
        currentPhaseId = generateUniqueId("phase");
        parsedPhases.push({
          id: currentPhaseId,
          name: phaseName,
          order: phaseOrder++,
        });
      }
    }
    // Match Tasks (- [ ] or - [x])
    else if (
      trimmedLine.startsWith("- [ ]") ||
      trimmedLine.startsWith("- [x]")
    ) {
      let taskText = trimmedLine.substring(5).trim();
      const status = trimmedLine.startsWith("- [x]") ? "done" : "todo";
      let dueDate = null;

      // Parse due date first
      const dateMatch = taskText.match(DUE_DATE_REGEX);
      if (dateMatch && dateMatch[1]) {
        dueDate = dateMatch[1];
        taskText = taskText.replace(DUE_DATE_REGEX, "").trim(); // Remove date from text
      }

      // Parse labels and get cleaned text
      const { cleanText, labels } = parseLabels(taskText);
      taskText = cleanText;

      if (taskText) {
        let taskPhaseId = currentPhaseId;
        if (!taskPhaseId) {
          // Task found before any phase definition
          if (!defaultPhaseAdded) {
            parsedPhases.push({
              id: defaultPhaseId,
              name: "Uncategorized Tasks", // Or 'General', 'Default'
              order: -1, // Or manage order differently
            });
            defaultPhaseAdded = true;
          }
          taskPhaseId = defaultPhaseId;
        }

        parsedTasks.push({
          id: generateUniqueId("task"),
          phaseId: taskPhaseId,
          text: taskText,
          status: status,
          dueDate: dueDate,
          labels: labels,
        });
      }
    }
    // Ignore other lines (like #, *, empty lines, etc.)
  });

  // Ensure phases are sorted if order was tracked and is important
  // parsedPhases.sort((a, b) => a.order - b.order);

  return { boards: parsedBoards, phases: parsedPhases, tasks: parsedTasks };
};
