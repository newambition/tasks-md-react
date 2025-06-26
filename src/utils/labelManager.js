import { useState, useEffect, useRef } from "react";
import { FaTag, FaTimes, FaPlus } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export const LabelManager = ({
  taskLabels,
  boardLabels,
  onUpdateTask,
  onCreateLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("#4299e1"); // Default to a nice blue
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleLabel = (labelId) => {
    const newLabels = taskLabels.includes(labelId)
      ? taskLabels.filter((id) => id !== labelId)
      : [...taskLabels, labelId];
    onUpdateTask({ labels: newLabels });
  };

  const handleCreateLabel = () => {
    if (newLabelName.trim()) {
      onCreateLabel(newLabelName.trim(), newLabelColor);
      setNewLabelName("");
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-xs font-semibold p-1 rounded-md hover:bg-cartoon-bg-medium"
      >
        <FaTag />
        <span>Labels</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 5 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-full left-0 mb-2 w-60 z-[9999] p-3 rounded-xl border-2"
            style={{
              backgroundColor: "var(--cartoon-bg-light)",
              borderColor: "var(--cartoon-border-dark)",
              boxShadow: "3px 3px 0px var(--cartoon-shadow-color)",
            }}
          >
            <p className="text-xs font-bold mb-2">Assign Labels</p>
            <ul className="mb-2 max-h-28 overflow-y-auto">
              {boardLabels.map((label) => (
                <li
                  key={label.id}
                  onClick={() => handleToggleLabel(label.id)}
                  className="flex items-center justify-between cursor-pointer p-1.5 rounded-md hover:bg-cartoon-bg-medium"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full border-2"
                      style={{
                        backgroundColor: label.color,
                        borderColor: "var(--cartoon-border-dark)",
                      }}
                    />
                    <span className="text-sm">{label.name}</span>
                  </span>
                  {taskLabels.includes(label.id) && (
                    <FaTimes className="text-xs text-cartoon-secondary" />
                  )}
                </li>
              ))}
            </ul>
            <div
              className="pt-2 border-t-2 border-dashed"
              style={{ borderColor: "var(--cartoon-border-medium)" }}
            >
              <p className="text-xs font-bold mb-2">Create New Label</p>
              <input
                type="text"
                placeholder="New label name..."
                value={newLabelName}
                onChange={(e) => setNewLabelName(e.target.value)}
                className="input-base text-sm w-full mb-2"
              />
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={newLabelColor}
                  onChange={(e) => setNewLabelColor(e.target.value)}
                  className="w-8 h-8 p-0 border-2 rounded-md"
                  style={{ borderColor: "var(--cartoon-border-dark)" }}
                />
                <button
                  onClick={handleCreateLabel}
                  className="btn btn-primary text-xs px-3 py-1.5 flex-grow"
                >
                  <FaPlus className="inline mr-1" /> Create
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
