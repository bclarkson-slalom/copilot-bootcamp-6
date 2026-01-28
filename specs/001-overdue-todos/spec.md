# Feature Specification: Support for Overdue Todo Items

**Feature Branch**: `001-overdue-todos`  
**Created**: 2026-01-28  
**Status**: Draft  
**Input**: User description: "Support for Overdue Todo Items - Users need a clear, visual way to identify which todos have not been completed by their due date"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visual Identification of Overdue Todos (Priority: P1)

Users viewing their todo list can immediately identify which incomplete tasks are overdue through clear visual indicators, allowing them to quickly prioritize their work without manually comparing dates.

**Why this priority**: This is the core value proposition. Users need to see overdue items at a glance - without this, the feature provides no value.

**Independent Test**: Can be fully tested by creating todos with past due dates and verifying they display with distinct visual styling. Delivers immediate value by helping users identify overdue tasks.

**Acceptance Scenarios**:

1. **Given** a todo with a due date in the past and status incomplete, **When** the user views the todo list, **Then** the todo displays with overdue styling (e.g., red text or background)
2. **Given** a todo with a due date in the past and status completed, **When** the user views the todo list, **Then** the todo does NOT display overdue styling (completed todos are not overdue)
3. **Given** a todo with a due date of today and status incomplete, **When** the user views the todo list, **Then** the todo does NOT display overdue styling (due today is not yet overdue)
4. **Given** a todo with no due date, **When** the user views the todo list, **Then** the todo does NOT display overdue styling (no due date means no overdue state)
5. **Given** a todo with a due date in the future and status incomplete, **When** the user views the todo list, **Then** the todo does NOT display overdue styling

---

### User Story 2 - Overdue Count Badge (Priority: P2)

Users can see at a glance how many overdue todos they have through a count badge or indicator in the UI header, helping them understand their backlog severity without scrolling through the list.

**Why this priority**: Provides quick awareness of overdue items count but is secondary to actually seeing which items are overdue in the list itself.

**Independent Test**: Can be tested by creating multiple overdue todos and verifying the count displays correctly. Delivers value by providing a summary metric of overdue tasks.

**Acceptance Scenarios**:

1. **Given** three incomplete todos with past due dates, **When** the user views the app, **Then** the overdue count badge displays "3"
2. **Given** no todos with past due dates, **When** the user views the app, **Then** the overdue count badge displays "0" or is hidden
3. **Given** two incomplete overdue todos and one completed overdue todo, **When** the user views the app, **Then** the overdue count badge displays "2" (only counts incomplete)
4. **Given** user marks an overdue todo as complete, **When** the todo status updates, **Then** the overdue count decreases by 1

---

### User Story 3 - Sort by Overdue Status (Priority: P3)

Users can optionally sort their todo list to show overdue items at the top, making it easier to focus on past-due tasks without visual scanning.

**Why this priority**: Nice-to-have enhancement that improves the experience but isn't essential for identifying overdue items. Users can already see overdue items via visual styling.

**Independent Test**: Can be tested by enabling overdue sorting and verifying overdue todos appear before non-overdue todos. Delivers value by grouping urgent items together.

**Acceptance Scenarios**:

1. **Given** a mix of overdue and non-overdue todos, **When** the user enables "sort by overdue", **Then** all overdue incomplete todos appear at the top of the list
2. **Given** overdue sorting is enabled, **When** the user adds a new overdue todo, **Then** it appears in the overdue section at the top
3. **Given** overdue sorting is enabled, **When** the user marks an overdue todo as complete, **Then** it moves out of the overdue section
4. **Given** overdue sorting is enabled, **When** the user disables the sort, **Then** todos return to default sort order (creation date)

---

### Edge Cases

- What happens when a todo becomes overdue while the user is viewing the list? (Real-time update behavior)
- How does the system handle todos with due dates set to midnight today? (Should they be overdue after midnight or only starting tomorrow?)
- What if the user's system clock is incorrect? (Rely on browser date/time, accept this limitation)
- How are overdue todos displayed in dark mode vs light mode? (Visual contrast must remain clear in both themes)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST calculate overdue status by comparing todo due date with current date
- **FR-002**: System MUST apply overdue styling only to incomplete todos with past due dates
- **FR-003**: System MUST NOT apply overdue styling to completed todos regardless of due date
- **FR-004**: System MUST update overdue status dynamically when todos are marked complete/incomplete
- **FR-005**: System MUST display overdue count badge showing number of incomplete overdue todos
- **FR-006**: System MUST update overdue count in real-time as todos are added, completed, or deleted
- **FR-007**: System MUST consider a todo overdue when due date is before the current date (not including today)
- **FR-008**: Users MUST be able to optionally sort todos to show overdue items first
- **FR-009**: System MUST maintain existing todo functionality (create, edit, delete, complete) with overdue feature

### Key Entities

- **Todo**: Existing entity with additional derived property `isOverdue`
  - `isOverdue` is calculated based on: `dueDate < currentDate AND completed === false`
  - No changes to stored data structure - this is a computed property

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify overdue todos within 2 seconds of viewing the todo list (visual distinction is immediate and clear)
- **SC-002**: Users correctly understand overdue status 95%+ of the time (styling is unambiguous - user testing shows high comprehension)
- **SC-003**: Overdue count updates within 500ms of user actions (marking complete, adding todos) to feel instantaneous
- **SC-004**: Overdue styling maintains WCAG AA color contrast standards in both light and dark modes (4.5:1 ratio for text)
- **SC-005**: Users can complete the primary task "identify and mark overdue todos complete" in under 30 seconds

## Assumptions *(mandatory)*

- Browser/system date and time are reasonably accurate (accept this limitation rather than implementing server-side time sync)
- "Overdue" means due date is before today's date (not including today - today is "due today", not "overdue")
- Existing todo functionality (UI, data persistence, CRUD operations) remains unchanged
- Visual styling for overdue items will use the existing theme's danger/warning colors (per UI guidelines)
- Overdue status is calculated client-side in real-time (no backend API changes required)

## Out of Scope

- Notifications or reminders about overdue todos
- Email or push notifications for overdue items
- Snooze or reschedule functionality for overdue todos
- Automatic due date adjustment or suggestions
- Overdue analytics or reporting (e.g., "you have X overdue items this week")
- Filtering to show only overdue items (sorting is in scope, but not filtering)
- Recurring todos or automatic due date rollover

## Dependencies

- Existing todo data model must include `dueDate` and `completed` fields
- Access to current date/time in the frontend
- Theme system must support danger/warning color variants for overdue styling
- Todo list rendering logic must be extensible to apply conditional styling

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Browser date incorrect | Medium | Accept as limitation; document in user docs that overdue detection relies on system time |
| Performance with large lists | Low | Overdue calculation is simple date comparison, O(n) complexity acceptable for expected todo list sizes (<1000 items) |
| Color contrast issues | Medium | Test both themes against WCAG AA standards; provide alternative visual indicators (icons) if needed |
| Timezone confusion | Low | Use browser's local date, document that overdue is based on user's local timezone |
