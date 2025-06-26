// src/components/Header.js
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useTheme } from "../context/ThemeContext";
import { FaInfoCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import InfoModal from "./InfoModal";

const Header = React.memo(
  ({
    tasks = [],
    searchTerm,
    onSearchChange,
    // Label filter props
    boardLabels = [],
    selectedLabelIds = [],
    onSelectedLabelIdsChange,
    // Due Date filter props
    dueDateFilter,
    onDueDateFilterChange,
  }) => {
    const { theme, toggleTheme } = useTheme();
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
    const filterDropdownRef = useRef(null);

    const [infoOpen, setInfoOpen] = useState(false);
    const closeInfoModal = useCallback(() => setInfoOpen(false), []);

    const handleClickOutside = useCallback((event) => {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target)
      ) {
        setIsFilterDropdownOpen(false);
      }
    }, []);

    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
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
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full sticky top-0 z-40"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderBottom: "3px solid var(--cartoon-border-dark)",
          boxShadow: "0px 4px 0px var(--cartoon-header-shadow)",
          fontFamily: "var(--cartoon-font)",
        }}
      >
        <div className="flex items-center justify-between w-full px-4 py-3 ">
          <div className="flex items-center gap-3 md:gap-4 flex-wrap">
            <h1
              className="text-3xl md:text-3xl font-black mr-2 md:mx-2 mt-1 tracking-tighter cursor-default select-none"
              style={{
                color: "var(--text-heading)",
                fontFamily: "var(--cartoon-font)",
              }}
            >
              TaskMD Pro
            </h1>

            {/* Search Input and Filter */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="input-base text-sm w-48 md:w-64"
              />

              {/* Filters Dropdown */}
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

                      {/* Due Date Filters */}
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

                      {/* Label Filters */}
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
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Theme Toggle */}
            <div
              className="relative flex items-center cursor-pointer select-none p-1"
              onClick={toggleTheme}
              title={
                theme === "light"
                  ? "Switch to Dark Mode"
                  : "Switch to Light Mode"
              }
              style={{
                border: "2px solid var(--cartoon-border-dark)",
                boxShadow: "2px 2px 0px var(--cartoon-shadow-color)",
                borderRadius: "30px",
                width: "56px",
                height: "32px",
              }}
            >
              <motion.div
                className="w-full h-full rounded-full"
                style={{
                  backgroundColor:
                    theme === "dark"
                      ? "var(--cartoon-secondary)"
                      : "var(--cartoon-border-medium)",
                  border: "2px solid var(--cartoon-border-dark)",
                  borderRadius: "28px",
                }}
                layout
              />
              <motion.div
                className="absolute top-0 left-0 flex items-center h-full w-full px-[3px]"
                layout
              >
                <motion.span
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: "20px",
                    height: "20px",
                    backgroundColor: "var(--cartoon-text-light)",
                    border: "1px solid var(--cartoon-border-dark)",
                    x: theme === "dark" ? "28px" : "2px",
                  }}
                  layout
                  transition={{ type: "spring", stiffness: 600, damping: 25 }}
                ></motion.span>
              </motion.div>
            </div>

            {/* Info Button */}
            <button
              className="action-btn text-xl flex items-center justify-center"
              title="Info"
              onClick={() => setInfoOpen(true)}
              type="button"
            >
              <FaInfoCircle />
            </button>
          </div>
        </div>

        {/* Info Modal */}
        <InfoModal open={infoOpen} onClose={closeInfoModal} />
      </motion.header>
    );
  }
);

export default Header;
