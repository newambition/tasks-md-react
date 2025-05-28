// src/utils/helpers.js

/**
 * Checks if a date string represents a date in the past (before today).
 * Assumes dateString is in 'YYYY-MM-DD' format.
 * Returns false if dateString is null, undefined, or invalid.
 */
export function isOverdue(dateString) {
    if (!dateString) return false;
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize today to the start of the day
      // Append time to avoid timezone issues where parsing just YYYY-MM-DD might be off by a day
      const dueDate = new Date(dateString + 'T00:00:00');
      return dueDate < today;
    } catch (e) {
      console.error("Error parsing date:", dateString, e);
      return false;
    }
  }
  
  /**
   * Formats a date string (YYYY-MM-DD) into a more readable format (e.g., "Aug 15").
   * Returns an empty string if dateString is null, undefined, or invalid.
   */
  export function formatDate(dateString) {
    if (!dateString) return '';
    try {
      const date = new Date(dateString + 'T00:00:00'); // Append time for consistency
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return dateString; // Return original string as fallback
    }
  }
  
  /**
   * Generates a simple unique ID (useful for new tasks later).
   */
  export function generateUniqueId(prefix = 'id') {
      return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }