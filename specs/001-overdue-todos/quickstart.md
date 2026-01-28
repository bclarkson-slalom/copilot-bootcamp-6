# Quickstart: Support for Overdue Todo Items

**Feature**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)  
**Date**: 2026-01-28

## Overview

This guide helps developers quickly understand and implement the overdue todos feature. Follow this guide after reading the specification.

## 🎯 What You're Building

Add visual identification of overdue todos through:
1. **Red text + light pink background** on overdue todo cards
2. **Count badge** next to "My Todos" header (e.g., "My Todos (3 overdue)")
3. **Optional sorting** via "Show overdue first" checkbox

## 🏗️ Architecture at a Glance

```
┌─────────────────────────────────────────────┐
│ App.js                                      │
│ - Display: "My Todos ({count} overdue)"    │
│ - Uses: getOverdueCount(todos)             │
└─────────────────────────────────────────────┘
                    │
                    ↓
┌─────────────────────────────────────────────┐
│ TodoList.js                                 │
│ - Show checkbox: "Show overdue first"      │
│ - Sort: sortTodos(todos, showOverdueFirst) │
└─────────────────────────────────────────────┘
                    │
                    ↓
┌─────────────────────────────────────────────┐
│ TodoCard.js                                 │
│ - Apply className if isOverdue()           │
│ - Styling: red text + light pink background│
└─────────────────────────────────────────────┘
                    │
                    ↓
┌─────────────────────────────────────────────┐
│ utils/dateUtils.js                         │
│ - isOverdue(dueDate, completed)            │
│ - getOverdueCount(todos)                   │
│ - sortTodos(todos, showOverdueFirst)       │
└─────────────────────────────────────────────┘
```

**Key Insight**: All logic is client-side. No backend changes. Pure functions in utils.

## 📦 New Files to Create

```
packages/frontend/src/
└── utils/
    ├── dateUtils.js              # NEW: Core utility functions
    └── __tests__/
        └── dateUtils.test.js     # NEW: Unit tests
```

## 📝 Files to Modify

```
packages/frontend/src/
├── components/
│   ├── TodoCard.js           # Add conditional className
│   ├── TodoList.js           # Add sort checkbox & logic
│   └── __tests__/
│       ├── TodoCard.test.js  # Add overdue styling tests
│       └── TodoList.test.js  # Add sort tests
├── App.js                    # Add overdue count to header
└── __tests__/
    └── App.test.js           # Add header count tests
```

## 🚀 Implementation Steps

### Step 1: Create Utility Functions (TDD)

**File**: `packages/frontend/src/utils/__tests__/dateUtils.test.js`

Write tests first (TDD approach):
```javascript
import { isOverdue, getOverdueCount, sortTodos } from '../dateUtils';

describe('isOverdue', () => {
  test('returns false for completed todos', () => {
    expect(isOverdue('2026-01-25', true)).toBe(false);
  });
  
  test('returns false for todos with no due date', () => {
    expect(isOverdue(null, false)).toBe(false);
  });
  
  test('returns false for todos due today', () => {
    const today = new Date().toISOString().split('T')[0];
    expect(isOverdue(today, false)).toBe(false);
  });
  
  test('returns true for incomplete todos with past due date', () => {
    expect(isOverdue('2020-01-01', false)).toBe(true);
  });
});

// Add tests for getOverdueCount and sortTodos...
```

**File**: `packages/frontend/src/utils/dateUtils.js`

Implement functions to make tests pass:
```javascript
export function isOverdue(dueDate, completed) {
  if (completed) return false;
  if (!dueDate) return false;
  
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return due < today;
}

export function getOverdueCount(todos) {
  return todos.filter(todo => isOverdue(todo.dueDate, todo.completed)).length;
}

export function sortTodos(todos, showOverdueFirst) {
  // Implementation here...
}
```

### Step 2: Add Overdue Styling to TodoCard

**File**: `packages/frontend/src/components/__tests__/TodoCard.test.js`

Add test:
```javascript
test('applies overdue styling to overdue incomplete todos', () => {
  const overdueTodo = { 
    id: '1', 
    title: 'Overdue', 
    dueDate: '2020-01-01', 
    completed: false 
  };
  render(<TodoCard todo={overdueTodo} />);
  const card = screen.getByTestId('todo-card');
  expect(card).toHaveClass('overdue');
});
```

**File**: `packages/frontend/src/components/TodoCard.js`

Add conditional className:
```javascript
import { isOverdue } from '../utils/dateUtils';

function TodoCard({ todo }) {
  const overdueClass = isOverdue(todo.dueDate, todo.completed) ? 'overdue' : '';
  
  return (
    <div className={`todo-card ${overdueClass}`} data-testid="todo-card">
      {/* existing card content */}
    </div>
  );
}
```

**File**: `packages/frontend/src/styles/theme.css`

Add overdue styles:
```css
.todo-card.overdue {
  background-color: var(--danger-bg-light, #ffe6e6);
  color: var(--danger-text, #d32f2f);
}

[data-theme="dark"] .todo-card.overdue {
  background-color: var(--danger-bg-dark, #4a2020);
  color: var(--danger-text-dark, #ff6b6b);
}
```

### Step 3: Add Overdue Count to Header

**File**: `packages/frontend/src/__tests__/App.test.js`

Add test:
```javascript
test('displays overdue count in header when overdue todos exist', () => {
  const todos = [
    { id: '1', title: 'Overdue', dueDate: '2020-01-01', completed: false },
    { id: '2', title: 'Future', dueDate: '2030-01-01', completed: false },
  ];
  render(<App todos={todos} />);
  expect(screen.getByText(/My Todos \(1 overdue\)/i)).toBeInTheDocument();
});
```

**File**: `packages/frontend/src/App.js`

Add count to header:
```javascript
import { getOverdueCount } from './utils/dateUtils';

function App() {
  const [todos, setTodos] = useState([]);
  const overdueCount = getOverdueCount(todos);
  
  return (
    <div className="app">
      <header>
        <h1>
          My Todos {overdueCount > 0 && `(${overdueCount} overdue)`}
        </h1>
      </header>
      {/* rest of app */}
    </div>
  );
}
```

### Step 4: Add Sort Checkbox to TodoList

**File**: `packages/frontend/src/components/__tests__/TodoList.test.js`

Add test:
```javascript
test('sorts overdue todos first when checkbox is checked', () => {
  const todos = [
    { id: '1', title: 'Future', dueDate: '2030-01-01', completed: false },
    { id: '2', title: 'Overdue', dueDate: '2020-01-01', completed: false },
  ];
  render(<TodoList todos={todos} />);
  
  const checkbox = screen.getByLabelText(/show overdue first/i);
  fireEvent.click(checkbox);
  
  const items = screen.getAllByTestId('todo-card');
  expect(items[0]).toHaveTextContent('Overdue');
  expect(items[1]).toHaveTextContent('Future');
});
```

**File**: `packages/frontend/src/components/TodoList.js`

Add checkbox and sort:
```javascript
import { useState } from 'react';
import { sortTodos } from '../utils/dateUtils';

function TodoList({ todos }) {
  const [showOverdueFirst, setShowOverdueFirst] = useState(false);
  const sortedTodos = sortTodos([...todos], showOverdueFirst);
  
  return (
    <div>
      <label>
        <input 
          type="checkbox" 
          checked={showOverdueFirst}
          onChange={(e) => setShowOverdueFirst(e.target.checked)}
        />
        Show overdue first
      </label>
      
      <div className="todo-list">
        {sortedTodos.map(todo => (
          <TodoCard key={todo.id} todo={todo} />
        ))}
      </div>
    </div>
  );
}
```

## ✅ Testing Checklist

Run after each step:
```bash
# Run tests in watch mode
npm test --workspace=packages/frontend -- --watch

# Check coverage
npm test --workspace=packages/frontend -- --coverage
```

Verify:
- [ ] All dateUtils tests pass
- [ ] TodoCard displays overdue styling
- [ ] App header shows correct overdue count
- [ ] TodoList sort checkbox works
- [ ] Coverage ≥ 80%

## 🎨 Styling Requirements

Ensure WCAG AA compliance (4.5:1 contrast):
- Light mode: Red text (#d32f2f) on light pink (#ffe6e6)
- Dark mode: Light red (#ff6b6b) on dark red tint (#4a2020)

Test both themes before committing.

## 🐛 Common Pitfalls

1. **Forgetting to normalize dates**: Always set hours to 00:00:00 for date-only comparison
2. **Not handling null dueDate**: Check for null before date operations
3. **Including completed todos in count**: Filter by `isOverdue()` not just past date
4. **Mutating original array**: Use `[...todos]` before sorting
5. **Missing dark mode styles**: Test both themes

## 📊 Success Criteria

Before marking complete, verify:
- ✅ Overdue todos have red text + light pink background
- ✅ Header shows "(X overdue)" when overdue todos exist
- ✅ Header shows no count when no overdue todos
- ✅ Checkbox toggles sort correctly
- ✅ Completed overdue todos don't show as overdue
- ✅ All tests pass with ≥80% coverage
- ✅ Both light and dark modes look correct
- ✅ WCAG AA contrast verified

## 🚀 Next Steps

After implementation:
1. Run full test suite: `npm test`
2. Manual testing in both themes
3. Create PR with link to spec and plan
4. Code review against constitution principles

## 📚 Reference

- **Spec**: [spec.md](spec.md) - Complete feature requirements
- **Research**: [research.md](research.md) - Technical decisions and rationale
- **Data Model**: [data-model.md](data-model.md) - Detailed logic and algorithms
- **Constitution**: [.specify/memory/constitution.md](../../.specify/memory/constitution.md) - Project principles
