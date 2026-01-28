/**
 * Unit tests for date utility functions
 * 
 * Following TDD approach - tests written before implementation
 */

import { isOverdue, getOverdueCount } from '../dateUtils';

describe('isOverdue', () => {
  test('returns false for completed todos regardless of due date', () => {
    const pastDate = '2025-01-01';
    expect(isOverdue(pastDate, true)).toBe(false);
  });

  test('returns false when no due date is provided', () => {
    expect(isOverdue(null, false)).toBe(false);
    expect(isOverdue(undefined, false)).toBe(false);
    expect(isOverdue('', false)).toBe(false);
  });

  test('returns false for todos due today', () => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    expect(isOverdue(todayStr, false)).toBe(false);
  });

  test('returns false for future due dates', () => {
    const future = new Date();
    future.setDate(future.getDate() + 5);
    const futureStr = future.toISOString().split('T')[0];
    expect(isOverdue(futureStr, false)).toBe(false);
  });

  test('returns true for incomplete todos with past due dates', () => {
    const past = new Date();
    past.setDate(past.getDate() - 1);
    const pastStr = past.toISOString().split('T')[0];
    expect(isOverdue(pastStr, false)).toBe(true);
  });

  test('handles invalid date strings gracefully', () => {
    expect(isOverdue('invalid-date', false)).toBe(false);
    expect(isOverdue('2025-13-45', false)).toBe(false);
  });

  test('uses midnight boundary for date comparison', () => {
    // Yesterday should be overdue regardless of time
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    expect(isOverdue(yesterdayStr, false)).toBe(true);
  });
});

describe('getOverdueCount', () => {
  test('returns 0 when there are no overdue todos', () => {
    const todos = [
      { id: '1', title: 'Test', dueDate: null, completed: false },
      { id: '2', title: 'Test', dueDate: '2099-12-31', completed: false }
    ];
    expect(getOverdueCount(todos)).toBe(0);
  });

  test('returns correct count with mixed overdue and non-overdue todos', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    const future = new Date();
    future.setDate(future.getDate() + 5);
    const futureStr = future.toISOString().split('T')[0];

    const todos = [
      { id: '1', title: 'Overdue 1', dueDate: yesterdayStr, completed: false },
      { id: '2', title: 'Future', dueDate: futureStr, completed: false },
      { id: '3', title: 'Overdue 2', dueDate: '2025-01-01', completed: false }
    ];
    expect(getOverdueCount(todos)).toBe(2);
  });

  test('excludes completed overdue todos from count', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const todos = [
      { id: '1', title: 'Overdue incomplete', dueDate: yesterdayStr, completed: false },
      { id: '2', title: 'Overdue complete', dueDate: yesterdayStr, completed: true }
    ];
    expect(getOverdueCount(todos)).toBe(1);
  });

  test('handles empty array', () => {
    expect(getOverdueCount([])).toBe(0);
  });

  test('handles null or undefined input', () => {
    expect(getOverdueCount(null)).toBe(0);
    expect(getOverdueCount(undefined)).toBe(0);
  });
});
