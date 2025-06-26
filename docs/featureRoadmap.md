# TaskMD Pro Feature Roadmap

Ideas for major feature upgrades and additions.

## Phase 1: Core Task Management Enhancements (Frontend Focus)

- [x] **Task Detail View & Editing:** Implement expanding taskcard for full task details (description, dates, activity). [important] (23-06-25)
- [x] **Subtasks / Checklists:** Add checklist functionality within the task detail view. (20-06-25)
- [x] **Filtering & Searching:** Implement keyword search across tasks on the current board. (26-06-25)
- [ ] **Advanced Filtering:** Add filter options (e.g., by due date range, labels).(10-01-25)
- [x] **Labels** Allow creating and assigning custom color-coded labelsto tasks. [review(#06d6a0)] (27-06-25)

## Phase 2: Workflow & Customization

- [ ] **Customizable Columns:** Allow users to add, rename, reorder, and delete columns per board.
- [ ] **WIP (Work-in-Progress) Limits:** Enable setting max task limits per column and visually indicate when limits are met
- [ ] **Export to Markdown:** Add functionality to export the current board state back to an `.md` file.
- [ ] **Enhanced Markdown Parsing:** Improve import to recognize additional syntax (e.g., `#tags`, `!priority`, `@assignee`).

## Phase 3: Backend & Collaboration (Requires Backend Implementation)

- [ ] ** User Accounts:** Migrate from `localStorage` to a backend database with user authentication.
- [ ] **Task Assignment:** Allow assigning tasks to registered users.
- [ ] **Comments & Activity Log:** Implement comment threads and change history for tasks.
- [ ] **Real-time Sync:** Use WebSockets or similar for instant updates across collaborators.
- [ ] **Board Sharing & Permissions:** Allow users to invite others and set view/edit permissions.
- [ ] **Calendar View:** Add a calendar view showing tasks based on due dates.
- [ ] **Due Date Reminders/Notifications:** Implement system notifications for upcoming or overdue tasks.
