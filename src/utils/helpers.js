// src/utils/helpers.js

/**
 * Parses a date string in DD-MM-YY format to a Date object
 * Returns null if dateString is null, undefined, or invalid.
 */
export function parseDate(dateString) {
  if (!dateString) return null;
  try {
    // Parse DD-MM-YY format
    const [day, month, year] = dateString.split("-").map(Number);
    // Assuming 20xx for YY format
    const fullYear = 2000 + year;
    // Month is 0-indexed in JS Date
    return new Date(fullYear, month - 1, day);
  } catch (e) {
    console.error("Error parsing date:", dateString, e);
    return null;
  }
}

/**
 * Checks if a date string represents a date in the past (before today).
 * Now supports DD-MM-YY format.
 * Returns false if dateString is null, undefined, or invalid.
 */
export function isOverdue(dateString) {
  if (!dateString) return false;
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to the start of the day

    const dueDate = parseDate(dateString);
    return dueDate < today;
  } catch (e) {
    console.error("Error checking overdue:", dateString, e);
    return false;
  }
}

/**
 * Formats a date string (DD-MM-YY) into a more readable format (e.g., "Aug 15").
 * Returns an empty string if dateString is null, undefined, or invalid.
 */
export function formatDate(dateString) {
  if (!dateString) return "";
  try {
    const date = parseDate(dateString);
    if (!date) return "";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } catch (e) {
    console.error("Error formatting date:", dateString, e);
    return dateString; // Return original string as fallback
  }
}

/**
 * Determines the status of a due date relative to today
 * Returns one of: 'overdue', 'today', 'tomorrow', 'upcoming', or null
 */
export function getDueDateStatus(dateString) {
  if (!dateString) return null;
  try {
    const dueDate = parseDate(dateString);
    if (!dueDate) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const inFourDays = new Date(today);
    inFourDays.setDate(inFourDays.getDate() + 4);

    if (dueDate < today) return "overdue";
    if (dueDate.getTime() === today.getTime()) return "today";
    if (dueDate.getTime() === tomorrow.getTime()) return "tomorrow";
    if (dueDate < inFourDays) return "upcoming";

    return null; // For dates more than 4 days away
  } catch (e) {
    console.error("Error getting date status:", dateString, e);
    return null;
  }
}

/**
 * Generates a simple unique ID (useful for new tasks later).
 */
export function generateUniqueId(prefix = "id") {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/**
 * Formats labels array into markdown format
 * @param {Array} labelIds - Array of label IDs
 * @param {Array} boardLabels - Array of board label objects with {id, name, color}
 * @returns {string} - Formatted labels string like "[urgent(#ff0000)][bug(#00ff00)]"
 */
export function formatLabelsForExport(labelIds, boardLabels) {
  if (!labelIds || labelIds.length === 0 || !boardLabels) return "";

  return labelIds
    .map((labelId) => {
      const label = boardLabels.find((bl) => bl.id === labelId);
      if (!label) return null;

      // Only include color if it's not the default blue
      if (label.color && label.color !== "#4299e1") {
        return `[${label.name}(${label.color})]`;
      } else {
        return `[${label.name}]`;
      }
    })
    .filter(Boolean) // Remove any null entries
    .join("");
}

/**
 * Export the content back into markdown format
 * Updated to handle the new task structure with proper labels format
 */
export function exportContent(boards, phases, tasks, boardLabels = []) {
  let content = "";

  // Export boards
  boards.forEach((board) => {
    content += `# ${board.name}\n\n`;
  });

  // Group tasks by phase and export by phase
  phases.forEach((phase) => {
    content += `## ${phase.name}\n`;

    // Find tasks for this phase
    const phaseTasks = tasks.filter((task) => task.phaseId === phase.id);

    phaseTasks.forEach((task) => {
      const checkbox = task.status === "done" ? "- [x]" : "- [ ]";
      const dueDateText = task.dueDate ? ` (${task.dueDate})` : "";
      const labelsText = formatLabelsForExport(task.labels, boardLabels);

      content += `${checkbox} ${task.text}${labelsText}${dueDateText}\n`;
    });

    content += "\n"; // Add spacing between phases
  });

  return content;
}
