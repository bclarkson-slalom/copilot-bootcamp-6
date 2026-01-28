# Implementation Plan: Support for Overdue Todo Items

**Branch**: `001-overdue-todos` | **Date**: 2026-01-28 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-overdue-todos/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Add visual identification of overdue todos through client-side computed properties and styling. Users will see overdue incomplete todos with red text and light pink background tint, a count badge next to the "My Todos" header, and optional sorting via checkbox. The feature requires no backend changes - all logic is client-side date comparison calculated on each React render.

## Technical Context

**Language/Version**: JavaScript (ES6+) / Node.js v16+  
**Primary Dependencies**: React 18, React DOM, Express.js, Jest, @testing-library/react  
**Storage**: SQLite (existing backend database with todos table)  
**Testing**: Jest with @testing-library/react for frontend, Jest for backend  
**Target Platform**: Web browsers (desktop-focused, Chrome/Firefox/Safari/Edge)  
**Project Type**: Web application (monorepo: frontend + backend packages)  
**Performance Goals**: <500ms overdue count update, <2s visual identification, <30s complete task workflow  
**Constraints**: Client-side calculation only (no backend changes), WCAG AA color contrast (4.5:1), existing todo functionality unchanged  
**Scale/Scope**: Expected <1000 todos per user, single-user application, no real-time sync required

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with [constitution principles](/.specify/memory/constitution.md):

- [x] **Code Quality**: Design follows DRY, KISS, and SOLID principles - utility function for date comparison, computed property pattern, no duplication
- [x] **Testing**: TDD approach planned with 80%+ coverage target - test files for utility, components, integration scenarios
- [x] **Single Responsibility**: Each component/module has one clear purpose - date utility, styling logic, sort logic, count logic all separated
- [x] **Clean Code**: Naming, formatting, and organization standards defined - `isOverdue` helper, `getOverdueCount` utility, clear component names
- [x] **Error Handling**: All failure scenarios identified and handled - date parsing, null checks, edge cases documented
- [x] **Technology Standards**: Uses approved stack (React, Express, Jest, npm workspaces) - no new dependencies required
- [x] **Architecture**: Follows monorepo structure with proper layer separation - frontend utils/, components/, no backend changes

**Status**: ✅ PASS - All constitution principles satisfied. No violations or exceptions required.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
packages/
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── TodoCard.js           # Update: Add overdue styling
│       │   ├── TodoList.js           # Update: Add sort checkbox & logic
│       │   └── __tests__/
│       │       ├── TodoCard.test.js  # Update: Add overdue styling tests
│       │       └── TodoList.test.js  # Update: Add sort tests
│       ├── utils/                    # NEW directory
│       │   ├── dateUtils.js          # NEW: isOverdue, getOverdueCount utilities
│       │   └── __tests__/
│       │       └── dateUtils.test.js # NEW: Date utility tests
│       ├── App.js                    # Update: Add overdue count to header
│       └── __tests__/
│           └── App.test.js           # Update: Add header count tests
└── backend/
    └── (no changes - all logic client-side)
```

**Structure Decision**: Web application monorepo. Frontend-only changes to add computed overdue logic, styling, and sort functionality. Backend remains unchanged as overdue status is derived client-side from existing `dueDate` and `completed` fields.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
