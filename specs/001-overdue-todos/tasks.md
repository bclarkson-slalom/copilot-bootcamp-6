# Tasks: Support for Overdue Todo Items

**Input**: Design documents from `/specs/001-overdue-todos/`  
**Prerequisites**: plan.md (✓), spec.md (✓), research.md (✓), data-model.md (✓), contracts/ (✓)

**Feature Description**: Add visual identification of overdue todos through client-side computed properties. Users see overdue incomplete todos with red text + light pink background, count badge in header, and optional sorting via checkbox. All logic is client-side - no backend changes required.

## Format: `- [ ] [ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend**: `packages/frontend/src/`
- **Backend**: No changes required for this feature
- **Tests**: Colocated in `__tests__/` directories

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create project structure for new utility module

- [ ] T001 Create utils directory at packages/frontend/src/utils/
- [ ] T002 Create __tests__ directory at packages/frontend/src/utils/__tests__/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core date utility functions that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 [P] Write unit tests for isOverdue() function in packages/frontend/src/utils/__tests__/dateUtils.test.js
- [ ] T004 Implement isOverdue() utility function in packages/frontend/src/utils/dateUtils.js (depends on T003)
- [ ] T005 [P] Write unit tests for getOverdueCount() function in packages/frontend/src/utils/__tests__/dateUtils.test.js
- [ ] T006 Implement getOverdueCount() utility function in packages/frontend/src/utils/dateUtils.js (depends on T005)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Visual Identification of Overdue Todos (Priority: P1) 🎯 MVP

**Goal**: Display overdue todos with red text color + light pink background tint so users can immediately identify incomplete past-due tasks

**Independent Test**: Create todo with past due date, verify red text + pink background applied. Mark complete, verify styling removed.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T007 [P] [US1] Write test: overdue incomplete todo gets 'overdue' className in packages/frontend/src/components/__tests__/TodoCard.test.js
- [ ] T008 [P] [US1] Write test: completed overdue todo does NOT get 'overdue' className in packages/frontend/src/components/__tests__/TodoCard.test.js
- [ ] T009 [P] [US1] Write test: todo due today does NOT get 'overdue' className in packages/frontend/src/components/__tests__/TodoCard.test.js
- [ ] T010 [P] [US1] Write test: todo with no due date does NOT get 'overdue' className in packages/frontend/src/components/__tests__/TodoCard.test.js

### Implementation for User Story 1

- [ ] T011 [US1] Import isOverdue utility in packages/frontend/src/components/TodoCard.js
- [ ] T012 [US1] Add conditional className logic to TodoCard component in packages/frontend/src/components/TodoCard.js
- [ ] T013 [US1] Add overdue CSS styles to packages/frontend/src/styles/theme.css (red text + light pink background for light mode)
- [ ] T014 [US1] Add dark mode overdue CSS styles to packages/frontend/src/styles/theme.css (light red text + dark red tint background)
- [ ] T015 [US1] Verify WCAG AA contrast ratio (4.5:1) for both light and dark mode overdue styles

**Checkpoint**: User Story 1 complete - overdue todos visually distinguishable ✓

---

## Phase 4: User Story 2 - Overdue Count Badge (Priority: P2)

**Goal**: Display overdue count next to "My Todos" header (e.g., "My Todos (3 overdue)") so users know backlog severity at a glance

**Independent Test**: Create multiple overdue todos, verify count displays correctly in header. Mark one complete, verify count decreases.

### Tests for User Story 2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T016 [P] [US2] Write test: header displays "(3 overdue)" when 3 overdue todos exist in packages/frontend/src/__tests__/App.test.js
- [ ] T017 [P] [US2] Write test: header displays no count when 0 overdue todos exist in packages/frontend/src/__tests__/App.test.js
- [ ] T018 [P] [US2] Write test: count only includes incomplete overdue todos (excludes completed) in packages/frontend/src/__tests__/App.test.js
- [ ] T019 [P] [US2] Write test: count updates when todo is marked complete in packages/frontend/src/__tests__/App.test.js

### Implementation for User Story 2

- [ ] T020 [US2] Import getOverdueCount utility in packages/frontend/src/App.js
- [ ] T021 [US2] Calculate overdue count in App component using getOverdueCount(todos) in packages/frontend/src/App.js
- [ ] T022 [US2] Update header JSX to conditionally display count in packages/frontend/src/App.js (format: "My Todos {count > 0 && `(${count} overdue)`}")
- [ ] T023 [US2] Verify count updates on add/complete/delete todo actions

**Checkpoint**: User Story 2 complete - overdue count visible in header ✓

---

## Phase 5: User Story 3 - Sort by Overdue Status (Priority: P3)

**Goal**: Add "Show overdue first" checkbox so users can optionally group overdue todos at top of list

**Independent Test**: Check "Show overdue first" checkbox, verify overdue todos appear before non-overdue. Uncheck, verify return to default sort.

### Tests for User Story 3

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T024 [P] [US3] Write unit tests for sortTodos() function in packages/frontend/src/utils/__tests__/dateUtils.test.js
- [ ] T025 [US3] Implement sortTodos() utility function in packages/frontend/src/utils/dateUtils.js (depends on T024)
- [ ] T026 [P] [US3] Write test: checking "Show overdue first" moves overdue todos to top in packages/frontend/src/components/__tests__/TodoList.test.js
- [ ] T027 [P] [US3] Write test: unchecking returns to default sort (creation date) in packages/frontend/src/components/__tests__/TodoList.test.js
- [ ] T028 [P] [US3] Write test: adding overdue todo while sorted places it at top in packages/frontend/src/components/__tests__/TodoList.test.js

### Implementation for User Story 3

- [ ] T029 [US3] Import sortTodos utility and useState in packages/frontend/src/components/TodoList.js
- [ ] T030 [US3] Add showOverdueFirst state (boolean, default false) to TodoList component in packages/frontend/src/components/TodoList.js
- [ ] T031 [US3] Add checkbox UI with label "Show overdue first" in packages/frontend/src/components/TodoList.js
- [ ] T032 [US3] Wire checkbox onChange to update showOverdueFirst state in packages/frontend/src/components/TodoList.js
- [ ] T033 [US3] Apply sortTodos() to todos array before rendering in packages/frontend/src/components/TodoList.js
- [ ] T034 [US3] Verify sort works correctly with mixed overdue/non-overdue todos

**Checkpoint**: User Story 3 complete - optional sort by overdue status ✓

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final integration testing, documentation, and quality checks

- [ ] T035 [P] Run full test suite and verify 80%+ code coverage (npm test -- --coverage)
- [ ] T036 [P] Test complete workflow: create overdue todo → verify styling → verify count → verify sort → mark complete → verify updates
- [ ] T037 [P] Manual testing in light mode - verify red text + light pink background has WCAG AA contrast
- [ ] T038 [P] Manual testing in dark mode - verify light red text + dark red tint background has WCAG AA contrast
- [ ] T039 [P] Test edge case: app left open overnight, verify overdue status updates on next interaction
- [ ] T040 [P] Test edge case: midnight boundary - todo due today does not show as overdue until tomorrow
- [ ] T041 [P] Update component JSDoc comments with overdue-related prop/behavior documentation
- [ ] T042 [P] Run linter and fix any warnings (npm run lint)

---

## Task Summary

**Total Tasks**: 42

**By Phase**:
- Phase 1 (Setup): 2 tasks
- Phase 2 (Foundational): 4 tasks
- Phase 3 (US1 - Visual Identification): 9 tasks
- Phase 4 (US2 - Count Badge): 8 tasks
- Phase 5 (US3 - Sort): 11 tasks
- Phase 6 (Polish): 8 tasks

**By User Story**:
- US1 (P1): 9 tasks - Visual identification (MVP)
- US2 (P2): 8 tasks - Count badge
- US3 (P3): 11 tasks - Sort functionality

**Parallel Opportunities**: 15 tasks marked [P] can run in parallel within their phase

**Foundational Tasks**: 4 tasks MUST complete before user stories begin

---

## Dependencies & Execution Order

### Critical Path
```
Setup (T001-T002)
  → Foundational (T003-T006) [BLOCKING]
    → US1 Tests (T007-T010) can run parallel
      → US1 Implementation (T011-T015) sequential
    → US2 Tests (T016-T019) can run parallel [can start after T006]
      → US2 Implementation (T020-T023) sequential
    → US3 Tests (T024-T025, T026-T028) can run parallel [can start after T006]
      → US3 Implementation (T029-T034) sequential
    → Polish (T035-T042) can run parallel [after all user stories complete]
```

### Parallel Execution Examples

**After Foundational (T003-T006) completes**, these can run in parallel:
- Developer A: US1 Tests (T007-T010)
- Developer B: US2 Tests (T016-T019)
- Developer C: US3 unit tests (T024-T025)

**After US1 Implementation completes**:
- Developer A: US1 Polish (manual testing T037-T038)
- Developer B: US2 Implementation (T020-T023)
- Developer C: US3 Implementation (T029-T034)

---

## Implementation Strategy

### Suggested MVP Scope (for first PR)
**User Story 1 only** (T001-T015):
- Setup + Foundational + US1 = Minimal viable feature
- Users can immediately see overdue todos with visual styling
- Delivers core value proposition
- ~15 tasks, estimated 1-2 days

### Incremental Delivery
- **PR 1**: US1 (Visual Identification) - Core feature
- **PR 2**: US2 (Count Badge) - Enhanced awareness
- **PR 3**: US3 (Sort) - Optional convenience

Each PR is independently testable and delivers user value.

---

## Testing Coverage Target

**Goal**: ≥80% code coverage

**Expected Coverage**:
- `utils/dateUtils.js`: 100% (pure functions, all branches tested)
- `components/TodoCard.js`: 90%+ (conditional className logic)
- `components/TodoList.js`: 90%+ (sort logic, checkbox state)
- `App.js`: 85%+ (count calculation, conditional display)

**Coverage Verification**: Run `npm test -- --coverage` after each phase

---

## Acceptance Criteria Mapping

Each task maps to specific acceptance criteria from spec.md:

| Task Range | User Story | Acceptance Criteria |
|------------|------------|---------------------|
| T007-T015 | US1 | 5 scenarios (overdue styling conditions) |
| T016-T023 | US2 | 4 scenarios (count display and updates) |
| T024-T034 | US3 | 4 scenarios (sort behavior) |

All 13 acceptance scenarios covered by implementation tasks.

---

## Constitution Compliance Checklist

- ✅ **DRY**: Utility functions extracted (isOverdue, getOverdueCount, sortTodos)
- ✅ **KISS**: Simple date comparison, no complex timers or state management
- ✅ **SOLID**: Single responsibility - utils for logic, components for UI
- ✅ **TDD**: Tests written before implementation (T003-T010, T016-T019, T024-T028)
- ✅ **Coverage**: 80%+ target with comprehensive test tasks
- ✅ **Clean Code**: Clear naming, JSDoc comments, linting checks
- ✅ **Error Handling**: Null checks, edge case testing (T039-T040)

---

**Ready for implementation!** Start with Phase 1 (Setup) → Phase 2 (Foundational) → Phase 3 (US1 MVP)
