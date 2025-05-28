// src/components/Header.js
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaEdit, FaTrash, FaPlus, FaAngleDown, FaAngleUp, FaFolderOpen, FaInfoCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import InfoModal from './InfoModal';

// Animation variants (can be kept or simplified if not used extensively)
const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95 }
};

const iconButtonVariants = {
  hover: { scale: 1.15, color: 'var(--text-link)', transition: { duration: 0.2 } },
  tap: { scale: 0.9 }
};

const dropdownItemVariants = {
  hover: { backgroundColor: 'var(--bg-tertiary)', x: 2, transition: {duration: 0.15} },
};

// Define a consistent button height/padding class
const headerButtonBaseClass = "flex items-center gap-2 justify-between px-3 py-2 rounded-md border border-solid border-border-color bg-bg-secondary text-button-secondary-text font-medium text-sm transition-all duration-200";
const headerButtonMinWidth = "min-w-[180px] md:min-w-[200px]"; // Adjusted for a bit more space, can be fine-tuned
const headerButtonTextMaxWidth = "max-w-[130px] md:max-w-[150px]";


const Header = React.memo(({ // Wrapped Header with React.memo
  boards, activeBoard, activeBoardPhases = [], activePhaseId,
  onAddBoard, onSelectBoard, onRenameBoard, onDeleteBoard,
  onSelectPhase, onLoadMarkdown,
  onAddPhase, onRenamePhase, onDeletePhase
}) => {
  const { theme, toggleTheme } = useTheme(); // toggleTheme from context should be stable
  const [isBoardDropdownOpen, setIsBoardDropdownOpen] = useState(false);
  const [isPhaseDropdownOpen, setIsPhaseDropdownOpen] = useState(false);
  const [isEditingBoardName, setIsEditingBoardName] = useState(false);
  const [editingBoardId, setEditingBoardId] = useState(null);
  const [newBoardNameInput, setNewBoardNameInput] = useState('');

  const [isEditingPhaseName, setIsEditingPhaseName] = useState(false);
  const [editingPhaseId, setEditingPhaseId] = useState(null);
  const [newPhaseNameInput, setNewPhaseNameInput] = useState('');
  const phaseEditInputRef = useRef(null);

  const editInputRef = useRef(null);
  const boardDropdownRef = useRef(null);
  const phaseDropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  const [infoOpen, setInfoOpen] = useState(false);
  const closeInfoModal = useCallback(() => setInfoOpen(false), []); // Memoize for InfoModal prop

  useEffect(() => {
    if (isEditingBoardName && editingBoardId && editInputRef.current) {
      const boardToEdit = boards.find(b => b.id === editingBoardId);
      if (boardToEdit) setNewBoardNameInput(boardToEdit.name);
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditingBoardName, editingBoardId, boards]);

  useEffect(() => {
    if (isEditingPhaseName && editingPhaseId && phaseEditInputRef.current) {
      const phaseToEdit = activeBoardPhases.find(p => p.id === editingPhaseId);
      if (phaseToEdit) setNewPhaseNameInput(phaseToEdit.name);
      phaseEditInputRef.current.focus();
      phaseEditInputRef.current.select();
    }
  }, [isEditingPhaseName, editingPhaseId, activeBoardPhases]);

  const handleClickOutside = useCallback((event) => {
    // ... (existing logic is fine)
    if (boardDropdownRef.current && !boardDropdownRef.current.contains(event.target)) {
      setIsBoardDropdownOpen(false);
      if(isEditingBoardName) setIsEditingBoardName(false); // Keep this part
    }
    if (phaseDropdownRef.current && !phaseDropdownRef.current.contains(event.target)) {
      setIsPhaseDropdownOpen(false);
      if(isEditingPhaseName) setIsEditingPhaseName(false); // Keep this part
    }
  }, [isEditingBoardName, isEditingPhaseName]); // Add dependencies if they affect the logic, e.g. setIsEditingBoardName setters

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]); // handleClickOutside is memoized

  const toggleBoardDropdown = () => { setIsBoardDropdownOpen(prev => !prev); setIsEditingBoardName(false); };
  const togglePhaseDropdown = () => { setIsPhaseDropdownOpen(prev => !prev); setIsEditingPhaseName(false); };

  // Props like onAddBoard are assumed to be memoized by useKanbanManager
  const handleAddBoard = () => { 
    const newBoardName = prompt("Enter name for the new board:");
    if (newBoardName && newBoardName.trim()) {
        onAddBoard(newBoardName.trim());
    } else if (newBoardName !== null) { 
        alert("Board name cannot be empty.");
    }
    setIsBoardDropdownOpen(false); 
  };
  // ... other handlers (handleSelectBoard, handleRenameBoardClick, saveBoardName, handleEditInputKeyDown, handleDeleteBoard)
  // ... (handleSelectPhase, handleAddPhase, handleRenamePhaseClick, savePhaseName, handlePhaseEditInputKeyDown, handleDeletePhase)
  // ... (handleFileChange)
  // These internal handlers either use stable setters from useState or call memoized props.

  // Re-inserting full handlers for completeness where minor changes might be needed or for context
  const internalHandleSelectBoard = (boardId) => { 
    if (activeBoard?.id !== boardId) onSelectBoard(boardId); // onSelectBoard is memoized
    setIsBoardDropdownOpen(false);
  };
  const internalHandleRenameBoardClick = (boardId, currentName, e) => { 
    e.stopPropagation(); setEditingBoardId(boardId); setNewBoardNameInput(currentName); setIsEditingBoardName(true);
  };
  const internalSaveBoardName = () => { 
    if (editingBoardId && newBoardNameInput.trim()) {
        onRenameBoard(editingBoardId, newBoardNameInput.trim()); // onRenameBoard is memoized
    } else if (newBoardNameInput.trim()==='') { 
        alert("Board name cannot be empty."); 
        const b = boards.find(b=>b.id===editingBoardId); 
        if(b) setNewBoardNameInput(b.name); 
        editInputRef.current?.focus(); return; 
    }
    setIsEditingBoardName(false); setEditingBoardId(null);
  };
  const internalHandleEditInputKeyDown = (e) => { 
    if (e.key === 'Enter') internalSaveBoardName(); 
    else if (e.key === 'Escape') { setIsEditingBoardName(false); setEditingBoardId(null); }
  };
  const internalHandleDeleteBoard = (boardId, e) => { 
    e.stopPropagation(); 
    onDeleteBoard(boardId); // onDeleteBoard is memoized
    if (editingBoardId === boardId) { setIsEditingBoardName(false); setEditingBoardId(null); } 
  };

  const internalHandleSelectPhase = (phaseId) => { 
    onSelectPhase(phaseId); // onSelectPhase is memoized
    setIsPhaseDropdownOpen(false); 
  };
  
  const internalHandleAddPhase = (e) => {
    e.stopPropagation(); 
    const newPhaseName = prompt("Enter name for the new phase:");
    if (newPhaseName && newPhaseName.trim()) {
      onAddPhase(newPhaseName.trim()); // onAddPhase is memoized
    } else if (newPhaseName !== null) {
      alert("Phase name cannot be empty.");
    }
  };

  const internalHandleRenamePhaseClick = (phaseId, currentName, e) => {
    e.stopPropagation();
    setEditingPhaseId(phaseId);
    setNewPhaseNameInput(currentName);
    setIsEditingPhaseName(true);
    setIsPhaseDropdownOpen(true); 
  };

  const internalSavePhaseName = () => {
    if (editingPhaseId && newPhaseNameInput.trim()) {
      onRenamePhase(editingPhaseId, newPhaseNameInput.trim()); // onRenamePhase is memoized
    } else if (newPhaseNameInput.trim() === '') {
      alert("Phase name cannot be empty.");
      const phase = activeBoardPhases.find(p => p.id === editingPhaseId);
      if (phase) setNewPhaseNameInput(phase.name);
      phaseEditInputRef.current?.focus();
      return;
    }
    setIsEditingPhaseName(false);
    setEditingPhaseId(null);
  };

  const internalHandlePhaseEditInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      internalSavePhaseName();
    } else if (e.key === 'Escape') {
      setIsEditingPhaseName(false);
      setEditingPhaseId(null);
    }
  };

  const internalHandleDeletePhase = (phaseId, e) => {
    e.stopPropagation();
    onDeletePhase(phaseId); // onDeletePhase is memoized
    if (editingPhaseId === phaseId) {
        setIsEditingPhaseName(false);
        setEditingPhaseId(null);
    }
  };

  const internalHandleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.md')) { 
      const reader = new FileReader(); 
      reader.onload = (e) => { 
        const content = e.target.result; 
        if (typeof onLoadMarkdown === 'function') onLoadMarkdown(content); // onLoadMarkdown is memoized
        else console.error("onLoadMarkdown is not a function");
      }; 
      reader.readAsText(file);
    } else if (file) {
      alert("Please select a valid Markdown (.md) file.");
    }
    if(fileInputRef.current) fileInputRef.current.value = "";
  };


  let currentPhaseName = "No Phases";
  if (activeBoard) {
    if (activeBoardPhases && activeBoardPhases.length > 0) {
        const currentActivePhaseDetails = activeBoardPhases.find(p => p.id === activePhaseId);
        if (currentActivePhaseDetails) {
            currentPhaseName = currentActivePhaseDetails.name;
        } else if (activeBoardPhases.length > 0) { // If activePhaseId is somehow invalid, default to first
             currentPhaseName = activeBoardPhases[0].name; 
             // Consider calling onSelectPhase(activeBoardPhases[0].id) here if this state is common
        } else {
            currentPhaseName = "Add Phase";
        }
    } else {
        currentPhaseName = "Add Phase";
    }
  }


  return (
    <motion.header 
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
      className="page-header w-full bg-bg-secondary shadow-sm sticky top-0 z-40"
    >
      <div className="flex items-center justify-between w-full px-4 py-3">
        <div className="flex items-center gap-3 md:gap-4 flex-wrap">
          {/* Removed animation, added new styling */}
          <h1 
            className="text-3xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-400 dark:from-blue-600 dark:to-indigo-300 font-header mr-2 md:mr-4 tracking-tight cursor-default select-none"
            // Removed whileHover and transition
          >
            TaskMD Pro
          </h1>
          
          <div className="relative" ref={boardDropdownRef}>
            <motion.button
              variants={buttonVariants} whileHover="hover" whileTap="tap"
              onClick={toggleBoardDropdown}
              disabled={boards.length === 0}
              // Applied consistent button classes
              className={`${headerButtonBaseClass} ${headerButtonMinWidth}`}
            >
              <span className={`truncate ${headerButtonTextMaxWidth}`}>
                {activeBoard ? activeBoard.name : (boards.length > 0 ? 'Select Board' : 'No Boards')}
              </span>
              {isBoardDropdownOpen ? <FaAngleUp /> : <FaAngleDown />}
            </motion.button>
            {isBoardDropdownOpen && boards.length > 0 && (
              <motion.div 
                // ... (dropdown motion props)
                className={`absolute top-full left-0 mt-1 w-full ${headerButtonMinWidth} max-h-72 overflow-y-auto bg-bg-secondary border border-border-color rounded-md shadow-lg z-50`}
                style={{ backgroundColor: 'var(--bg-secondary)' }}
              >
                <ul className="py-1">
                  {boards.map((board) => (
                    <motion.li 
                      key={board.id}
                      variants={dropdownItemVariants} whileHover="hover"
                      className={`px-3 py-2 cursor-pointer flex items-center justify-between text-sm ${activeBoard?.id === board.id ? 'bg-bg-tertiary font-semibold' : ''}`} 
                    >
                      {isEditingBoardName && editingBoardId === board.id ? (
                        <input ref={editInputRef} type="text" value={newBoardNameInput} onChange={(e) => setNewBoardNameInput(e.target.value)} onBlur={internalSaveBoardName} onKeyDown={internalHandleEditInputKeyDown} onClick={(e) => e.stopPropagation()} className="input-base text-sm py-1 px-2 w-full mr-2 flex-grow"/>
                      ) : (
                        <span onClick={() => internalHandleSelectBoard(board.id)} className="truncate flex-grow block">{board.name}</span>
                      )}
                      {(!isEditingBoardName || editingBoardId !== board.id) && (
                        <div className="flex items-center flex-shrink-0 ml-2">
                          <motion.button variants={iconButtonVariants} whileHover="hover" whileTap="tap" onClick={(e) => internalHandleRenameBoardClick(board.id, board.name, e)} className="action-btn p-1 text-xs" title="Rename board"><FaEdit /></motion.button>
                          {boards.length > 1 && (<motion.button variants={iconButtonVariants} whileHover="hover" whileTap="tap" onClick={(e) => internalHandleDeleteBoard(board.id, e)} className="action-btn action-btn-delete p-1 text-xs" title="Delete board"><FaTrash /></motion.button>)}
                        </div>
                      )}
                    </motion.li>
                  ))}
                  <li className="border-t border-border-color mt-1 pt-1">
                    <motion.button variants={dropdownItemVariants} whileHover="hover" onClick={handleAddBoard} className="w-full text-left px-3 py-2 text-sm text-text-link flex items-center gap-2">
                      <FaPlus className="text-green-500"/> Add New Board
                    </motion.button>
                  </li>
                </ul>
              </motion.div>
            )}
          </div>

          {activeBoard && (
            <div className="relative" ref={phaseDropdownRef}>
              <motion.button
                variants={buttonVariants} whileHover="hover" whileTap="tap"
                onClick={togglePhaseDropdown}
                disabled={!activeBoardPhases || activeBoardPhases.length === 0}
                // Applied consistent button classes
                className={`${headerButtonBaseClass} ${headerButtonMinWidth}`}
              >
                <span className={`truncate ${headerButtonTextMaxWidth}`}>{currentPhaseName}</span>
                {isPhaseDropdownOpen ? <FaAngleUp /> : <FaAngleDown />}
              </motion.button>
              {isPhaseDropdownOpen && activeBoardPhases && activeBoardPhases.length > 0 && (
                <motion.div 
                  // ... (dropdown motion props)
                  className={`absolute top-full left-0 mt-1 w-full ${headerButtonMinWidth} max-h-72 overflow-y-auto bg-bg-secondary border border-border-color rounded-md shadow-lg z-50`}
                  style={{ backgroundColor: 'var(--bg-secondary)' }}
                >
                  <ul className="py-1">
                    {(activeBoardPhases || []).map((phase) => (
                      <motion.li 
                        key={phase.id} 
                        variants={dropdownItemVariants} whileHover="hover"
                        className={`px-3 py-2 cursor-pointer text-sm flex items-center justify-between group ${activePhaseId === phase.id ? 'bg-bg-tertiary font-semibold' : ''}`} 
                      >
                        {isEditingPhaseName && editingPhaseId === phase.id ? (
                          <input ref={phaseEditInputRef} type="text" value={newPhaseNameInput} onChange={(e) => setNewPhaseNameInput(e.target.value)} onBlur={internalSavePhaseName} onKeyDown={internalHandlePhaseEditInputKeyDown} onClick={(e) => e.stopPropagation()} className="input-base text-sm py-1 px-2 w-full mr-2 flex-grow" />
                        ) : (
                          <span onClick={() => internalHandleSelectPhase(phase.id)} className="truncate flex-grow block">{phase.name}</span>
                        )}
                        {(!isEditingPhaseName || editingPhaseId !== phase.id) && (
                          <div className="flex items-center flex-shrink-0 ml-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150">
                            <motion.button variants={iconButtonVariants} whileHover="hover" whileTap="tap" onClick={(e) => internalHandleRenamePhaseClick(phase.id, phase.name, e)} className="action-btn p-1 text-xs" title="Rename phase"><FaEdit /></motion.button>
                            {activeBoardPhases.length > 1 && (
                                 <motion.button variants={iconButtonVariants} whileHover="hover" whileTap="tap" onClick={(e) => internalHandleDeletePhase(phase.id, e)} className="action-btn action-btn-delete p-1 text-xs" title="Delete phase"><FaTrash /></motion.button>
                            )}
                          </div>
                        )}
                      </motion.li>
                    ))}
                    <li className="border-t border-border-color mt-1 pt-1">
                      <motion.button variants={dropdownItemVariants} whileHover="hover" onClick={internalHandleAddPhase} className="w-full text-left px-3 py-2 text-sm text-text-link flex items-center gap-2"> 
                        <FaPlus className="text-green-500" /> Add New Phase 
                      </motion.button>
                    </li>
                  </ul>
                </motion.div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {activeBoard && (
            <motion.label 
              htmlFor="md-upload" 
              variants={buttonVariants} whileHover="hover" whileTap="tap"
              className="btn btn-secondary px-2 py-1 text-xs cursor-pointer flex items-center gap-1 h-[38px]" // Match height of other buttons approx (py-2 + border = 38px)
              title="Load tasks from .MD file into current board"
            >
              <FaFolderOpen /> Load MD
              <input ref={fileInputRef} type="file" id="md-upload" accept=".md" className="hidden" onChange={internalHandleFileChange} />
            </motion.label>
          )}
          {/* Theme Toggle Switch - Assuming height is visually consistent */}
          <motion.div /* ... */ > 
          <motion.div
            className="relative flex items-center cursor-pointer select-none"
            onClick={toggleTheme}
            initial={false}
            animate={theme}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            style={{ width: 48, height: 28 }}
          >
            <motion.div
              className={`w-12 h-7 rounded-full transition-colors duration-300 ${theme === 'dark' ? 'bg-button-secondary-bg' : 'bg-gray-300'}`}
              layout
            />
            <motion.div
              className="absolute left-0 top-0 flex items-center h-7 w-12 px-1"
              layout
            >
              <motion.span
                className="flex items-center justify-center w-5 h-5 rounded-full bg-white shadow-md"
                layout
                transition={{ type: 'spring', stiffness: 700, damping: 30 }}
                style={{ x: theme === 'dark' ? 20 : 0 }}
              >
                {theme === 'dark' ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 6.95-1.41-1.41M6.34 6.34 4.93 4.93m12.02 0-1.41 1.41M6.34 17.66l-1.41 1.41"/></svg>
                )}
              </motion.span>
              </motion.div>
            </motion.div>
          </motion.div>
          <button
            className="ml-2 action-btn text-xl flex items-center justify-center h-[38px] w-[38px]" // Approx match height
            title="Info"
            onClick={() => setInfoOpen(true)}
            type="button"
          >
            <FaInfoCircle />
          </button>
          <InfoModal open={infoOpen} onClose={closeInfoModal} /> {/* Use memoized onClose */}
        </div>
      </div>
    </motion.header>
  );
}); // End of React.memo
export default Header;