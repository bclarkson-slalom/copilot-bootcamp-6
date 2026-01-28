# Data Model: Support for Overdue Todo Items

**Feature**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)  
**Date**: 2026-01-28

## Overview

This feature adds no new entities or stored data. All overdue logic is computed client-side from existing Todo entity fields. This document describes the computed properties and their derivation.

## Entities

### Todo (Existing)

**Description**: Represents a user's todo item with optional due date

**Stored Fields** (no changes):
- `id`: number - Unique identifier (auto-increment)
- `title`: string - Todo title (required, max 255 chars)
- `dueDate`: string|null - Due date in ISO 8601 format (YYYY-MM-DD) or null
- `completed`: boolean - Completion status (true = complete, false = incomplete)
- `createdAt`: string - Creation timestamp in ISO 8601 format

**Computed Properties** (NEW - client-side only):
- `isOverdue`: boolean - Derived from `dueDate` and `completed`

**Derivation Logic**:
```javascript
/**
 * Determines if a todo is overdue
 * @param {string|null} dueDate - ISO format date string (YYYY-MM-DD)
 * @param {boolean} completed - Todo completion status
 * @returns {boolean} True if overdue, false otherwise
 */
function isOverdue(dueDate, completed) {
  // Completed todos are never overdue
  if (completed) return false;
  
  // No due date means no overdue state
  if (!dueDate) return false;
  
  // Compare dates at midnight (date-only comparison)
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Overdue if due date is before today (not including today)
  return due < today;
}
```

**State Transitions**:
```
[Todo Created] → dueDate=future, completed=false → isOverdue=false

[Due Date Passes] → dueDate=past, completed=false → isOverdue=true

[Marked Complete] → dueDate=past, completed=true → isOverdue=false

[Marked Incomplete] → dueDate=past, completed=false → isOverdue=true
```

**Validation Rules** (existing, unchanged):
- `title`: Required, non-empty string, max 255 characters
- `dueDate`: Optional, must be valid ISO 8601 date if provided
- `completed`: Boolean, defaults to false

## Computed Aggregates

### Overdue Count

**Description**: Total count of overdue todos (incomplete todos with past due dates)

**Calculation**:
```javascript
/**
 * Counts overdue todos
 * @param {Array} todos - Array of todo objects
 * @returns {number} Count of overdue todos
 */
function getOverdueCount(todos) {
  return todos.filter(todo => isOverdue(todo.dueDate, todo.completed)).length;
}
```

**Usage**: Displayed in App header as "My Todos ({count} overdue)"

**Update Trigger**: Recalculated on every component render

## Sorting Logic

### Overdue-First Sort

**Description**: Optional sort that groups overdue todos at top of list

**Algorithm**:
```javascript
/**
 * Sorts todos with overdue items first, then by creation date
 * @param {Array} todos - Array of todo objects
 * @param {boolean} showOverdueFirst - Whether to apply overdue-first sort
 * @returns {Array} Sorted array of todos
 */
function sortTodos(todos, showOverdueFirst) {
  if (!showOverdueFirst) {
    // Default sort: creation date descending (newest first)
    return todos.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
  }
  
  // Overdue-first sort
  return todos.sort((a, b) => {
    const aOverdue = isOverdue(a.dueDate, a.completed);
    const bOverdue = isOverdue(b.dueDate, b.completed);
    
    // Both overdue or both not overdue → sort by creation date
    if (aOverdue === bOverdue) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    
    // One overdue → overdue comes first
    return aOverdue ? -1 : 1;
  });
}
```

## Data Flow

```
[Backend API] → Todos with dueDate & completed
       ↓
[Frontend Service] → Parse JSON response
       ↓
[React State] → Store todo array
       ↓
[Component Render] → Compute isOverdue for each todo
       ↓
[TodoCard] → Apply styling if isOverdue=true
[TodoList] → Apply sort if showOverdueFirst=true
[App Header] → Display getOverdueCount(todos)
```

## Performance Considerations

- **isOverdue calculation**: O(1) per todo - simple date comparison
- **getOverdueCount calculation**: O(n) - single filter pass
- **sortTodos**: O(n log n) - JavaScript array sort

**Estimated Performance** (worst case: 1000 todos):
- isOverdue: <1ms per render
- getOverdueCount: <5ms per render
- sortTodos: <10ms per render

**Total per render**: <16ms (well under 16.67ms for 60fps)

## Testing Strategy

### Unit Tests (dateUtils.test.js)

Test `isOverdue()` function:
- ✅ Returns false for completed todos
- ✅ Returns false for todos with no due date
- ✅ Returns false for todos due today
- ✅ Returns false for todos due in future
- ✅ Returns true for incomplete todos with past due date
- ✅ Handles null/undefined dueDate
- ✅ Handles invalid date strings

Test `getOverdueCount()` function:
- ✅ Returns 0 when no overdue todos
- ✅ Returns correct count with mixed overdue/non-overdue
- ✅ Excludes completed overdue todos from count
- ✅ Handles empty array

Test `sortTodos()` function:
- ✅ Maintains creation date sort when showOverdueFirst=false
- ✅ Groups overdue todos first when showOverdueFirst=true
- ✅ Maintains creation date order within overdue/non-overdue groups

### Integration Tests

Test complete workflow:
- ✅ Create overdue todo → verify styling, count, and sort
- ✅ Mark overdue todo complete → verify styling removed, count decreased
- ✅ Toggle sort checkbox → verify todos reorder correctly

## Schema Changes

**None** - All existing database schema remains unchanged. No migrations required.

## Backward Compatibility

**100% Compatible** - Feature only adds client-side computed logic. All existing:
- API endpoints unchanged
- Database schema unchanged
- Todo CRUD operations unchanged
- Existing tests unchanged (only additions)

## Summary

This feature requires:
- ✅ 0 new stored fields
- ✅ 3 new utility functions (isOverdue, getOverdueCount, sortTodos)
- ✅ 0 database migrations
- ✅ 0 API changes
- ✅ 100% backward compatible

All logic is pure functions operating on existing data. No side effects, no external dependencies.
