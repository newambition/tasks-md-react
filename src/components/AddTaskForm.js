// src/components/AddTaskForm.js
import React, { useState } from "react"; // Import useState
import { motion } from "framer-motion";
import { LabelManager } from "../utils/labelManager";

const formButtonVariants = {
  hover: { scale: 1.05, y: -1, transition: { duration: 0.15 } },
  tap: { scale: 0.95, y: 1 },
};

// Receive onAddTask prop
const AddTaskForm = ({ onAddTask, onCancel, columnHeaderClass = "" }) => {
  const [taskText, setTaskText] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!taskText.trim()) {
      alert("Please enter a task description."); // Basic validation
      return;
    }
    // Call the passed-in function with the new task details
    onAddTask(taskText, dueDate || null); // Pass null if dueDate is empty

    // Clear the form
    setTaskText("");
    setDueDate("");
  };

  const getButtonBgStyle = () => {
    if (columnHeaderClass.includes("todo"))
      return {
        backgroundColor: "var(--cartoon-accent)",
        color: "var(--cartoon-border-dark)",
      };
    if (columnHeaderClass.includes("inprogress"))
      return {
        backgroundColor: "var(--cartoon-primary)",
        color: "var(--cartoon-text-light)",
      };
    if (columnHeaderClass.includes("done"))
      return {
        backgroundColor: "var(--cartoon-green)",
        color: "var(--cartoon-text-light)",
      };
    return {
      backgroundColor: "var(--cartoon-primary)",
      color: "var(--cartoon-text-light)",
    };
  };

  return (
    // Added py-4 for some vertical spacing for the section
    <section
      className="add-task-section"
      style={{ fontFamily: "var(--cartoon-font)" }}
    >
      {/* Use onSubmit for the form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-grow">
          <label htmlFor="new-task-input" className="sr-only">
            Task Description
          </label>
          <textarea
            id="new-task-input"
            placeholder="Enter task description..."
            className="input-base w-full text-sm"
            rows="3"
            value={taskText} // Controlled input
            onChange={(e) => setTaskText(e.target.value)} // Update state
            autoFocus
          />
        </div>
        <div className="flex-shrink-0">
          <label htmlFor="task-card-date" className="sr-only">
            Due Date
          </label>
          <input
            type="date"
            id="task-card-date"
            title="Due Date (Optional)"
            className="p-1 text-xs w-auto inline-block border-2 rounded-md outline-none"
            style={{
              fontFamily: "var(--cartoon-font)",
              borderColor: "var(--cartoon-border-dark)",
              backgroundColor: "white",
              color: "var(--cartoon-text-secondary)",
              boxShadow: "1px 1px 0px var(--cartoon-shadow-color)", // Subtle shadow for tiny input
            }}
            value={dueDate} // Controlled input
            onChange={(e) => setDueDate(e.target.value)} // Update state
          />
        </div>
        <div className="flex-shrink-0">
          <LabelManager
            taskLabels={[]}
            boardLabels={[]}
            onUpdateTask={() => {}}
            onCreateLabel={() => {}}
          />
        </div>
        <div className="flex-grow"></div>
        <div className="flex justify-end items-center gap-2.5">
          <motion.button
            type="button"
            variants={formButtonVariants}
            whileHover="hover"
            whileTap="tap"
            className="btn btn-secondary text-sm px-4 py-2"
            style={{
              fontFamily: "var(--cartoon-font)",
              color: "var(--cartoon-text-dark)",
            }}
            onClick={onCancel}
          >
            Cancel
          </motion.button>
          <motion.button
            type="submit"
            id="add-task-btn"
            variants={formButtonVariants}
            whileHover="hover"
            whileTap="tap"
            className="btn btn-primary text-sm px-4 py-2"
            style={{
              ...getButtonBgStyle(),
              fontFamily: "var(--cartoon-font)",
            }}
          >
            Add Task
          </motion.button>
        </div>
      </form>
    </section>
  );
};

export default AddTaskForm;
