// src/components/AddTaskForm.js
import React, { useState } from "react";
import { LabelManager } from "../utils/labelManager";
import TaskInputFields from "./TaskInputFields";
import FormActions from "./FormActions";

const AddTaskForm = ({ onAddTask, onCancel, columnHeaderClass = "" }) => {
  const [taskText, setTaskText] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskText.trim()) {
      alert("Please enter a task description.");
      return;
    }
    onAddTask(taskText, dueDate || null);
    setTaskText("");
    setDueDate("");
  };

  return (
    <section
      className="add-task-section"
      style={{ fontFamily: "var(--cartoon-font)" }}
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <TaskInputFields
          taskText={taskText}
          setTaskText={setTaskText}
          dueDate={dueDate}
          setDueDate={setDueDate}
        />
        <div className="flex-shrink-0">
          <LabelManager
            taskLabels={[]}
            boardLabels={[]}
            onUpdateTask={() => {}}
            onCreateLabel={() => {}}
          />
        </div>
        <div className="flex-grow"></div>
        <FormActions onCancel={onCancel} columnHeaderClass={columnHeaderClass} />
      </form>
    </section>
  );
};

export default AddTaskForm;
