
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

const SearchAndFilter = ({
  searchTerm,
  onSearchChange,
  boardLabels = [],
  selectedLabelIds = [],
  onSelectedLabelIdsChange,
  dueDateFilter,
  onDueDateFilterChange,
}) => {
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const filterDropdownRef = useRef(null);

  const handleClickOutside = useCallback((event) => {
    if (
      filterDropdownRef.current &&
      !filterDropdownRef.current.contains(event.target)
    ) {
      setIsFilterDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const handleToggleLabelFilter = (labelId) => {
    const newSelectedIds = selectedLabelIds.includes(labelId)
      ? selectedLabelIds.filter((id) => id !== labelId)
      : [...selectedLabelIds, labelId];
    onSelectedLabelIdsChange(newSelectedIds);
  };

  const handleDueDateFilterClick = (filter) => {
    onDueDateFilterChange(dueDateFilter === filter ? null : filter);
  };

  const clearAllFilters = () => {
    onSelectedLabelIdsChange([]);
    onDueDateFilterChange(null);
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="input-base text-sm w-48 md:w-64"
      />

      <div className="relative" ref={filterDropdownRef}>
        <motion.button
          onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
          className="btn btn-secondary px-3 py-2 text-sm cursor-pointer flex items-center gap-1.5"
          title="Filter by label"
        >
          <span className="flex items-center gap-1.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            <span>Filter</span>
            {(selectedLabelIds.length > 0 || dueDateFilter) && (
              <span className="bg-cartoon-primary text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                {selectedLabelIds.length + (dueDateFilter ? 1 : 0)}
              </span>
            )}
          </span>
        </motion.button>

        {isFilterDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-2 w-80 max-h-96 overflow-y-auto z-50"
            style={{
              backgroundColor: "var(--bg-component-explicit-white)",
              border: "3px solid var(--cartoon-border-dark)",
              borderRadius: "15px",
              boxShadow: "4px 4px 0px var(--cartoon-shadow-color)",
            }}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">
                  Filter Tasks
                </h3>
                {(selectedLabelIds.length > 0 || dueDateFilter) && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-[var(--cartoon-secondary)] hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-xs text-[var(--text-secondary)] mb-2 uppercase tracking-wide">
                  Due Date
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {["today", "overdue"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => handleDueDateFilterClick(filter)}
                      className={`filter-date-btn ${
                        dueDateFilter === filter ? "active" : ""
                      }`}
                    >
                      {filter === "today" ? "Due Today" : "Overdue"}
                    </button>
                  ))}
                </div>
              </div>

              {boardLabels.length > 0 && (
                <div>
                  <h4 className="font-semibold text-xs text-[var(--text-secondary)] mb-2 uppercase tracking-wide">
                    Labels
                  </h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {boardLabels.map((label) => (
                      <label
                        key={label.id}
                        className="flex items-center gap-3 cursor-pointer hover:bg-[var(--bg-secondary)] p-2 rounded-lg transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedLabelIds.includes(label.id)}
                          onChange={() =>
                            handleToggleLabelFilter(label.id)
                          }
                          className="rounded border-2 border-[var(--cartoon-border-dark)]"
                        />
                        <span
                          className="w-3 h-3 rounded-full border-2 border-[var(--cartoon-border-dark)]"
                          style={{ backgroundColor: label.color }}
                        ></span>
                        <span className="text-sm font-medium text-[var(--text-primary)] truncate">
                          {label.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SearchAndFilter;
