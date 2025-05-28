// src/components/AddTaskForm.js
import React, { useState } from 'react'; // Import useState

// Receive onAddTask prop
const AddTaskForm = ({ onAddTask }) => {
  const [taskText, setTaskText] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!taskText.trim()) {
      alert('Please enter a task description.'); // Basic validation
      return;
    }
    // Call the passed-in function with the new task details
    onAddTask(taskText, dueDate || null); // Pass null if dueDate is empty

    // Clear the form
    setTaskText('');
    setDueDate('');
  };

  return (
    // Added py-4 for some vertical spacing for the section
    <section className="add-task-section py-4" style={{fontFamily: 'var(--cartoon-font)'}}>
      {/* Use onSubmit for the form */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
        <div className="flex-grow">
          <label htmlFor="new-task-input" className="sr-only">
            Task Description
          </label>
          <input
            type="text"
            id="new-task-input"
            placeholder="Add a new task description..."
            className="input-base w-full" // Ensured w-full for consistency, input-base handles styling
            value={taskText} // Controlled input
            onChange={(e) => setTaskText(e.target.value)} // Update state
          />
        </div>
        <div className="flex-shrink-0">
          <label htmlFor="new-task-due-date" className="sr-only">
            Due Date
          </label>
          <input
            type="date"
            id="new-task-due-date"
            title="Due Date (Optional)"
            className="input-base h-full w-full sm:w-auto" // Ensured w-full for mobile, input-base handles styling
            value={dueDate} // Controlled input
            onChange={(e) => setDueDate(e.target.value)} // Update state
          />
        </div>
        <div className="flex-shrink-0">
          {/* Button type="submit" triggers form onSubmit */}
          {/* .btn and .btn-primary classes from index.css will apply cartoon style */}
          <button type="submit" id="add-task-btn" className="w-full sm:w-auto h-full btn btn-primary">
            Add Task
          </button>
        </div>
      </form>
    </section>
  );
};

export default AddTaskForm;