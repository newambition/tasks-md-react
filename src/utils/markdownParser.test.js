
import { parseMarkdown } from './markdownParser';

// Mock the generateUniqueId function to return predictable IDs for testing
jest.mock('./helpers', () => ({
  ...jest.requireActual('./helpers'), // Keep original functions
  generateUniqueId: jest.fn(),
}));

describe('parseMarkdown', () => {
  beforeEach(() => {
    // Reset the mock before each test
    jest.clearAllMocks();
    // Mock implementation for generateUniqueId
    const { generateUniqueId } = require('./helpers');
    generateUniqueId.mockImplementation((prefix) => `${prefix}-123`);
  });

  test('should parse a simple task', () => {
    const markdown = '- [ ] A simple task';
    const { tasks } = parseMarkdown(markdown);
    expect(tasks).toHaveLength(1);
    expect(tasks[0]).toEqual(expect.objectContaining({
      text: 'A simple task',
      status: 'todo',
      dueDate: null,
      labels: [],
    }));
  });

  test('should parse a completed task', () => {
    const markdown = '- [x] A completed task';
    const { tasks } = parseMarkdown(markdown);
    expect(tasks).toHaveLength(1);
    expect(tasks[0].status).toBe('done');
  });

  test('should parse a task with a due date', () => {
    const markdown = '- [ ] Task with a due date (25-12-24)';
    const { tasks } = parseMarkdown(markdown);
    expect(tasks).toHaveLength(1);
    expect(tasks[0].dueDate).toBe('25-12-24');
    expect(tasks[0].text).toBe('Task with a due date');
  });

  test('should parse a task with a single label', () => {
    const markdown = '- [ ] Task with a [bug] label';
    const { tasks } = parseMarkdown(markdown);
    expect(tasks).toHaveLength(1);
    expect(tasks[0].labels).toEqual([{ name: 'bug', color: '#4299e1' }]);
    expect(tasks[0].text).toBe('Task with a label');
  });

  test('should parse a task with a label and custom color', () => {
    const markdown = '- [ ] Task with a [feature(#ff0000)] label';
    const { tasks } = parseMarkdown(markdown);
    expect(tasks).toHaveLength(1);
    expect(tasks[0].labels).toEqual([{ name: 'feature', color: '#ff0000' }]);
  });

  test('should parse a task with multiple labels', () => {
    const markdown = '- [ ] [urgent] [bug] A critical task';
    const { tasks } = parseMarkdown(markdown);
    expect(tasks).toHaveLength(1);
    expect(tasks[0].labels).toEqual([
      { name: 'urgent', color: '#4299e1' },
      { name: 'bug', color: '#4299e1' },
    ]);
    expect(tasks[0].text).toBe('A critical task');
  });

  test('should parse a task with due date and labels', () => {
    const markdown = '- [ ] [feature] A task with everything (26-01-25)';
    const { tasks } = parseMarkdown(markdown);
    expect(tasks).toHaveLength(1);
    expect(tasks[0].dueDate).toBe('26-01-25');
    expect(tasks[0].labels).toEqual([{ name: 'feature', color: '#4299e1' }]);
    expect(tasks[0].text).toBe('A task with everything');
  });

  test('should parse multiple phases with tasks', () => {
    const markdown = `
      ## To Do
      - [ ] Task 1
      ## In Progress
      - [ ] Task 2
      - [x] Task 3
    `;
    const { phases, tasks } = parseMarkdown(markdown);
    expect(phases).toHaveLength(2);
    expect(tasks).toHaveLength(3);
    expect(phases[0].name).toBe('To Do');
    expect(phases[1].name).toBe('In Progress');
    expect(tasks.filter(t => t.phaseId === 'phase-123')).toHaveLength(3);
  });

  test('should handle tasks before any phase heading as "Uncategorized"', () => {
    const markdown = `
      - [ ] Uncategorized task
      ## Phase 1
      - [ ] Task in phase 1
    `;
    const { phases, tasks } = parseMarkdown(markdown);
    expect(phases).toHaveLength(2);
    expect(phases.find(p => p.name === 'Uncategorized Tasks')).toBeDefined();
    expect(tasks.find(t => t.text === 'Uncategorized task').phaseId).toBe('phase-123');
  });

  test('should parse board name', () => {
    const markdown = `
      # My Project Board
      ## To Do
      - [ ] A task
    `;
    const { boards, tasks } = parseMarkdown(markdown);
    expect(boards).toHaveLength(1);
    expect(boards[0].name).toBe('My Project Board');
    expect(tasks).toHaveLength(1);
  });

  test('should ignore empty lines and other markdown elements', () => {
    const markdown = `
      # Board
      ## Phase

      - [ ] Task 1

      * some other text
      - [ ] Task 2
    `;
    const { tasks } = parseMarkdown(markdown);
    expect(tasks).toHaveLength(2);
  });
});
