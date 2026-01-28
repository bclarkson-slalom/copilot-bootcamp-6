# API Contracts: Support for Overdue Todo Items

**Feature**: [spec.md](../spec.md) | **Plan**: [plan.md](../plan.md)  
**Date**: 2026-01-28

## Overview

This feature requires **NO API changes**. All overdue logic is computed client-side from existing todo data returned by current API endpoints.

## Existing API Endpoints (Unchanged)

### GET /api/todos
Returns all todos with existing fields including `dueDate` and `completed`.

**Response** (unchanged):
```json
[
  {
    "id": 1,
    "title": "Buy groceries",
    "dueDate": "2026-01-25",
    "completed": false,
    "createdAt": "2026-01-20T10:00:00Z"
  },
  {
    "id": 2,
    "title": "Submit report",
    "dueDate": "2026-01-30",
    "completed": false,
    "createdAt": "2026-01-22T14:30:00Z"
  }
]
```

Frontend computes `isOverdue` client-side from `dueDate` and `completed` fields.

### Other Endpoints (Unchanged)
- GET /api/todos/:id
- POST /api/todos
- PUT /api/todos/:id
- DELETE /api/todos/:id

All existing endpoints continue to work exactly as before. No request/response changes needed.

## Client-Side Computation

Instead of backend changes, the frontend adds computed properties:

```javascript
// In frontend component or service
const todosWithOverdue = todos.map(todo => ({
  ...todo,
  isOverdue: isOverdue(todo.dueDate, todo.completed)
}));
```

## Rationale

- **Specification Requirement**: Client-side calculation explicitly required
- **Simplicity**: No backend changes = less complexity, faster development
- **Performance**: Date comparison is lightweight, acceptable for expected scale
- **Constitution Alignment**: KISS principle - simplest solution that meets requirements
