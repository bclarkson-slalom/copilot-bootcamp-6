<!--
SYNC IMPACT REPORT - Constitution Update
Version: 0.1.0 → 1.0.0
Rationale: MAJOR - Initial constitution creation with full governance framework

Modified Principles:
- Created: I. Code Quality & Maintainability (DRY, KISS, SOLID)
- Created: II. Testing Excellence (NON-NEGOTIABLE) - TDD with 80%+ coverage
- Created: III. Single Responsibility & Modularity
- Created: IV. Clean Code Practices (formatting, naming, organization)
- Created: V. Type Safety & Error Handling

Added Sections:
- Technology Standards (monorepo, React, Express, Jest)
- Development Workflow & Quality Gates (PR requirements, testing gates)

Templates Updated:
✅ plan-template.md - Constitution Check section updated with concrete checkpoints
✅ spec-template.md - Already emphasizes independent testing (aligned)
✅ tasks-template.md - Already organized by user stories with test-first approach (aligned)
✅ .github/copilot-instructions.md - Added constitution reference at top of documentation list

Follow-up TODOs: None - all placeholders filled, all templates validated
-->

# Copilot Bootcamp Todo App Constitution

## Core Principles

### I. Code Quality & Maintainability

All code MUST adhere to DRY (Don't Repeat Yourself), KISS (Keep It Simple), and SOLID principles:

- **DRY**: Extract common code into shared functions or utilities. No code duplication.
- **KISS**: Prefer simple, straightforward implementations. Avoid premature optimization.
- **SOLID**: Single responsibility for all modules/components/functions. Use composition over inheritance. Depend on abstractions, not concrete implementations.
- **Readability First**: Code must be self-documenting and easy to understand at first glance.
- **Performance**: Use appropriate algorithms and data structures. Optimize only when necessary and justified.

**Rationale**: Maintainable code reduces technical debt, enables faster feature development, and makes the codebase accessible to all team members.

### II. Testing Excellence (NON-NEGOTIABLE)

Test-Driven Development is mandatory with 80%+ code coverage across all packages:

- **TDD Workflow**: Write tests describing expected behavior → Tests fail → Implement → Tests pass → Refactor
- **Test Behavior, Not Implementation**: Tests verify what code does, not how it does it
- **Test Independence**: Each test must set up its own data, clean up after itself, and not rely on other tests
- **Coverage Requirement**: 80%+ code coverage for unit tests, integration tests for component interactions
- **Mock External Dependencies**: API calls, timers, and external systems must be mocked in tests

**Rationale**: Testing ensures reliability, prevents regressions, and serves as living documentation. Non-negotiable status reflects project commitment to quality.

### III. Single Responsibility & Modularity

Every module, component, and function must have exactly one well-defined purpose:

- **Component Scope**: React components display/manage UI only. No business logic in components.
- **Service Layer**: Business logic resides in service modules, not in components or routes.
- **Function Scope**: Each function performs one task. Break complex operations into smaller functions.
- **Clear Boundaries**: Explicit separation between UI, business logic, and data access layers.
- **Reusability**: Build components and utilities that can be reused across the application.

**Rationale**: Single responsibility makes code easier to test, debug, and modify. Clear boundaries enable independent development and testing.

### IV. Clean Code Practices

Code must follow consistent formatting, naming, and organizational standards:

- **Formatting**: 2-space indentation, max 100 chars per line, LF line endings, no trailing whitespace
- **Naming**: camelCase for variables/functions, PascalCase for components/classes, UPPER_SNAKE_CASE for constants
- **Import Organization**: External libraries → Internal modules → Styles, with blank lines between groups
- **Code Organization**: Imports → Constants → Utilities → Main code → Helpers → Exports
- **Linting**: All ESLint errors and warnings must be resolved before PR submission
- **Comments**: Comment "why", not "what". Use JSDoc for public functions. No outdated comments.

**Rationale**: Consistent formatting and naming reduce cognitive load, improve readability, and enable team collaboration.

### V. Type Safety & Error Handling

All operations that can fail must handle errors gracefully:

- **Try-Catch**: Wrap all async operations and operations that can throw in try-catch blocks
- **User Feedback**: Inform users when operations fail with clear, actionable error messages
- **Error Logging**: Log errors with sufficient context for debugging
- **Input Validation**: Validate all user input and API data at boundaries
- **Defensive Coding**: Use default values and guard clauses to prevent undefined errors
- **JSDoc Types**: Use JSDoc type annotations for critical functions to document expected types

**Rationale**: Proper error handling prevents crashes, improves user experience, and makes debugging easier.

## Technology Standards

### Architecture
- **Monorepo Structure**: npm workspaces with separate frontend and backend packages
- **Frontend**: React-based web application with component-driven architecture
- **Backend**: Express.js REST API with service layer pattern
- **Testing Framework**: Jest for both frontend and backend

### Technology Stack Constraints
- **Node.js**: v16 or higher required
- **Package Manager**: npm v7 or higher (workspace support)
- **Frontend Dependencies**: React, React DOM, Jest, @testing-library/react
- **Backend Dependencies**: Express.js, Jest
- **No Database**: Use in-memory storage or file-based persistence (per backend implementation)

### Code Organization
- **Frontend Structure**: components/, services/, utils/, __tests__/
- **Backend Structure**: routes/, controllers/, services/, middleware/, __tests__/
- **Test Colocation**: Tests must be in __tests__/ directories alongside source files
- **File Naming**: Match component names. Test files use {filename}.test.js pattern

## Development Workflow & Quality Gates

### Pre-Commit Requirements
- All linting errors and warnings resolved (ESLint)
- All tests passing locally (`npm test`)
- Code formatted according to standards
- No console.log statements in production code
- All TODO comments addressed or tracked

### Pull Request Requirements
- **Atomic Commits**: Each commit represents one logical change with clear message
- **PR Description**: Clear explanation of changes and reasoning
- **Test Coverage**: New code must have accompanying tests
- **Code Review**: All PRs require review before merge
- **Constitution Compliance**: All core principles must be followed

### Testing Gates
- Unit tests must pass for all packages
- Integration tests must pass for feature workflows
- Coverage must remain at or above 80% threshold
- No failing tests allowed in main branch

### Version Control Practices
- **Feature Branches**: Use pattern feature/descriptive-name
- **Commit Messages**: Follow format: type: description (e.g., feat: add todo editing)
- **Branch Protection**: Main branch requires PR approval and passing tests

## Governance

This constitution supersedes all other development practices and guidelines. All team members must follow these principles without exception.

### Amendment Process
1. Propose amendment with clear rationale and impact analysis
2. Update constitution version following semantic versioning:
   - **MAJOR**: Backward incompatible changes (principle removal/redefinition)
   - **MINOR**: New principles or materially expanded guidance
   - **PATCH**: Clarifications, wording fixes, non-semantic refinements
3. Update LAST_AMENDED_DATE to date of change
4. Propagate changes to all dependent templates and documentation
5. Communicate changes to all team members

### Compliance Review
- All code reviews must verify constitution compliance
- Any violation must be corrected before merge
- Exceptions require explicit justification and team approval
- Constitution violations are blocking issues in code review

### Documentation Relationship
- Detailed guidelines reside in `/docs/` directory (coding-guidelines.md, testing-guidelines.md, etc.)
- Constitution defines non-negotiable principles; guidelines provide implementation details
- In case of conflict, constitution takes precedence

**Version**: 1.0.0 | **Ratified**: 2026-01-28 | **Last Amended**: 2026-01-28
