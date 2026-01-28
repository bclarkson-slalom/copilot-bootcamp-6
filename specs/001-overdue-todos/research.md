# Research: Support for Overdue Todo Items

**Feature**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)  
**Date**: 2026-01-28

## Overview

This document captures research findings and technical decisions for implementing overdue todo item detection and visualization. All decisions are based on the existing project structure, constitution principles, and UI guidelines.

## Research Questions & Findings

### 1. Date Comparison Logic

**Question**: What is the best approach for determining if a todo is overdue given JavaScript date handling complexities?

**Findings**:
- **JavaScript Date API**: Use `new Date()` for current date, compare date strings or timestamps
- **Best Practice**: Compare date-only values (strip time component) to match user mental model
- **Implementation**: Use `Date` object comparison with time normalized to start of day (00:00:00)

**Decision**: Create `isOverdue(dueDate, completed)` utility function that:
1. Returns `false` if `completed === true` (completed todos never overdue)
2. Returns `false` if `dueDate` is null/undefined (no due date = no overdue state)
3. Normalizes both dates to midnight (00:00:00) for date-only comparison
4. Returns `true` if due date < current date

**Rationale**: Simple, predictable behavior. Matches specification requirement that "due today" ≠ "overdue". Aligns with user expectation that overdue starts "tomorrow".

---

### 2. Component Re-render Strategy

**Question**: How should overdue status update in real-time without complex timers or intervals?

**Findings**:
- **React Best Practice**: Compute derived state on each render rather than storing in state
- **Performance**: Date comparison is O(1) operation, negligible cost even for 1000 todos
- **Midnight Boundary**: App will update overdue status on next user interaction after midnight (acceptable per spec)

**Decision**: Calculate `isOverdue` on every component render as a computed property. No timers, intervals, or special midnight handling needed.

**Rationale**: 
- KISS principle - simplest solution
- React already re-renders on state changes (add/edit/complete todo)
- User interaction after midnight naturally triggers re-render
- No memory leaks from timers
- Aligns with constitution's "optimize only when necessary" principle

---

### 3. Styling Approach

**Question**: How to apply overdue styling (red text + light pink background) across light and dark themes?

**Findings**:
- **Existing Theme System**: Project uses theme.css with CSS variables for light/dark modes
- **UI Guidelines**: Halloween theme with danger colors already defined
- **WCAG AA**: Requires 4.5:1 contrast ratio for text

**Decision**: Use conditional className on TodoCard based on `isOverdue()` result:
- Light mode: `--danger-text` (red) + `--danger-bg-light` (light pink)
- Dark mode: `--danger-text-dark` (light red) + `--danger-bg-dark` (dark red tint)
- Add to theme.css if colors don't exist

**Rationale**: 
- Leverages existing theme system
- Maintains WCAG compliance
- Single Responsibility - styling in CSS, logic in JS
- DRY - theme colors reused across application

---

### 4. Count Badge Implementation

**Question**: How to efficiently count overdue todos and display next to "My Todos" header?

**Findings**:
- **Current Header**: App.js renders "My Todos" title
- **Count Calculation**: Filter todos by `isOverdue()` and get length

**Decision**: Create `getOverdueCount(todos)` utility function:
```javascript
export function getOverdueCount(todos) {
  return todos.filter(todo => isOverdue(todo.dueDate, todo.completed)).length;
}
```

Display in App.js: `My Todos {overdueCount > 0 && `(${overdueCount} overdue)`}`

**Rationale**:
- Simple array filter operation - O(n) acceptable for expected scale
- Computed on each render (same as overdue styling)
- Conditional rendering - show only when count > 0
- Single Responsibility - counting logic extracted to utility

---

### 5. Sort Implementation

**Question**: How to implement optional "Show overdue first" sorting without breaking existing sort order?

**Findings**:
- **Current Sort**: Todos displayed in creation date order (newest first) per functional requirements
- **React Pattern**: Controlled checkbox state + conditional sort in render

**Decision**: 
1. Add `showOverdueFirst` boolean state in TodoList component
2. Add checkbox before or after list with controlled state
3. Apply sort: `todos.sort((a, b) => { if (showOverdueFirst) { /* overdue first logic */ } /* default sort */ })`

**Rationale**:
- Maintains default sort when unchecked
- No persistent state needed (checkbox state per session)
- Sort on every render - acceptable performance for <1000 todos
- Follows React patterns and constitution principles

---

### 6. Testing Strategy

**Question**: What testing approach ensures 80%+ coverage while following TDD principles?

**Findings**:
- **Unit Tests**: dateUtils.js functions (isOverdue, getOverdueCount)
- **Component Tests**: TodoCard styling, TodoList sort, App header count
- **Integration Tests**: Full flow - add overdue todo, verify all three features work

**Decision**: Test-first approach:
1. **dateUtils.test.js**: Test all date comparison edge cases (today, past, future, null, completed)
2. **TodoCard.test.js**: Test overdue className applied correctly
3. **TodoList.test.js**: Test sort checkbox toggle and todo ordering
4. **App.test.js**: Test overdue count display and updates
5. **Integration**: Test complete workflow across components

**Rationale**:
- Satisfies TDD requirement (tests first)
- Covers all acceptance criteria from spec
- Independent tests (each sets up own data)
- 80%+ coverage achievable with these tests
- Follows constitution's testing excellence principle

---

## Technical Decisions Summary

| Decision | Approach | Rationale |
|----------|----------|-----------|
| **Date Comparison** | Utility function with date-only comparison | Simple, predictable, matches user mental model |
| **Re-render Strategy** | Compute on every render | KISS - no timers needed, React handles naturally |
| **Styling** | Conditional className + theme CSS variables | Leverages existing system, WCAG compliant |
| **Count Badge** | Filter + length utility function | O(n) acceptable, simple implementation |
| **Sorting** | Controlled checkbox + conditional sort | Maintains default sort, no persistent state |
| **Testing** | Unit + Component + Integration tests | TDD approach, 80%+ coverage, constitution compliant |

---

## Alternative Approaches Considered

### Alternative 1: Store isOverdue in State
**Rejected**: Violates DRY (duplication of derived data), requires sync logic, more complex

### Alternative 2: Backend Calculates Overdue
**Rejected**: Spec requires client-side only, adds unnecessary backend changes, more complex

### Alternative 3: Midnight Timer for Auto-Update
**Rejected**: Premature optimization, memory leak risk, spec accepts update on next interaction

### Alternative 4: CSS-only Overdue Detection
**Rejected**: Not possible - requires JavaScript date comparison

---

## Dependencies Verification

All required dependencies already present in project:
- ✅ React 18 (components, hooks)
- ✅ Jest + @testing-library/react (testing)
- ✅ Existing theme.css (styling system)
- ✅ Todo data includes dueDate and completed fields

**No new dependencies required** ✅

---

## Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Browser date incorrect | Low | Medium | Accept per spec - document limitation |
| Performance with large lists | Low | Low | O(n) operations acceptable for <1000 todos |
| Color contrast failure | Low | Medium | Test both themes against WCAG AA before deploy |
| Timezone confusion | Low | Low | Document that local timezone is used |

---

## Next Steps

✅ Research complete - no NEEDS CLARIFICATION items remain  
→ Proceed to Phase 1: Data Model & Contracts
