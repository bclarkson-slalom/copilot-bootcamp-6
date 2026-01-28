/**
 * Date utility functions for todo overdue detection
 * 
 * All functions use date-only comparison (normalized to midnight)
 * to determine overdue status based on calendar days.
 */

/**
 * Check if a todo is overdue
 * @param {string} dueDate - ISO date string (YYYY-MM-DD)
 * @param {boolean} completed - Whether the todo is completed
 * @returns {boolean} True if incomplete and past due date
 */
export function isOverdue(dueDate, completed) {
  // Completed todos are never overdue
  if (completed) return false;
  
  // No due date means not overdue
  if (!dueDate || dueDate === '') return false;
  
  try {
    // Parse the due date and normalize to midnight
    const due = new Date(dueDate);
    
    // Check if date is valid
    if (isNaN(due.getTime())) return false;
    
    due.setHours(0, 0, 0, 0);
    
    // Get today's date normalized to midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Overdue if due date is before today
    return due < today;
  } catch (error) {
    // Invalid date string
    return false;
  }
}

/**
 * Count the number of overdue todos in an array
 * @param {Array} todos - Array of todo objects
 * @returns {number} Count of overdue incomplete todos
 */
export function getOverdueCount(todos) {
  // Handle null/undefined input
  if (!todos || !Array.isArray(todos)) return 0;
  
  return todos.filter(todo => isOverdue(todo.dueDate, todo.completed)).length;
}

/**
 * Sort todos with optional overdue-first ordering
 * @param {Array} todos - Array of todo objects
 * @param {boolean} showOverdueFirst - Whether to show overdue todos first
 * @returns {Array} Sorted array of todos
 */
export function sortTodos(todos, showOverdueFirst = false) {
  if (!todos || !Array.isArray(todos)) return [];
  
  if (!showOverdueFirst) {
    // Default sorting by createdAt (newest first)
    return [...todos].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB - dateA;
    });
  }
  
  // Sort with overdue first
  return [...todos].sort((a, b) => {
    const aOverdue = isOverdue(a.dueDate, a.completed);
    const bOverdue = isOverdue(b.dueDate, b.completed);
    
    // If overdue status differs, prioritize overdue
    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;
    
    // If both same overdue status, sort by createdAt
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB - dateA;
  });
}
