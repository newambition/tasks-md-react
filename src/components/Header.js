// src/components/Header.js
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaEdit, FaTrash, FaPlus, FaAngleDown, FaAngleUp, FaFolderOpen, FaInfoCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import InfoModal from './InfoModal';

// Animation variants (can be kept or simplified if not used extensively)
// These will complement the CSS hover/active states
const buttonVariants = {
  hover: { y: -1, x: -1, transition: { duration: 0.1 } }, // Subtle lift
  tap: { y: 1, x: 1, transition: { duration: 0.1 } } // Subtle press
};

const iconButtonVariants = {
  hover: { scale: 1.1, y: -1, x: -1, color: 'var(--cartoon-primary)', transition: { duration: 0.1 } },
  tap: { scale: 0.9, y: 1, x: 1, transition: { duration: 0.1 } }
};

const dropdownItemVariants = {
  // Using CSS variable for hover background color to ensure theme compatibility
  hover: { backgroundColor: 'var(--bg-secondary)', x: 2, transition: {duration: 0.15} },
};

// Updated consistent button styling for header dropdowns
const headerDropdownButtonBaseClass = `
  flex items-center gap-2 justify-between px-4 py-2 
  font-cartoon text-sm font-bold
  bg-[var(--bg-component-explicit-white)] text-[var(--text-primary)] 
  border-2 md:border-[2.5px] border-solid border-cartoon-border-dark 
  rounded-[10px] 
  shadow-[2px_2px_0px_var(--cartoon-border-dark)] 
  hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_var(--cartoon-border-dark)] 
  active:translate-x-[2px] active:translate-y-[2px] active:shadow-none 
  transition-all duration-150 ease-in-out cursor-pointer
  disabled:bg-cartoon-bg-medium disabled:text-cartoon-border-medium disabled:border-cartoon-border-medium disabled:shadow-[2px_2px_0px_var(--cartoon-border-medium)]
  disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-[2px_2px_0px_var(--cartoon-border-medium)]
`;

const headerButtonMinWidth = "min-w-[180px] md:min-w-[200px]";
const headerButtonTextMaxWidth = "max-w-[130px] md:max-w-[150px]";


const Header = React.memo(({
  boards, activeBoard, activeBoardPhases = [], activePhaseId,
  onAddBoard, onSelectBoard, onRenameBoard, onDeleteBoard,
  onSelectPhase, onLoadMarkdown,
  onAddPhase, onRenamePhase, onDeletePhase
}) => {
  const { theme, toggleTheme } = useTheme();
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
  const closeInfoModal = useCallback(() => setInfoOpen(false), []);

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
    if (boardDropdownRef.current && !boardDropdownRef.current.contains(event.target)) {
      setIsBoardDropdownOpen(false);
      if(isEditingBoardName) setIsEditingBoardName(false);
    }
    if (phaseDropdownRef.current && !phaseDropdownRef.current.contains(event.target)) {
      setIsPhaseDropdownOpen(false);
      if(isEditingPhaseName) setIsEditingPhaseName(false);
    }
  }, [isEditingBoardName, isEditingPhaseName]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const toggleBoardDropdown = () => { setIsBoardDropdownOpen(prev => !prev); setIsEditingBoardName(false); };
  const togglePhaseDropdown = () => { setIsPhaseDropdownOpen(prev => !prev); setIsEditingPhaseName(false); };

  const handleAddBoard = () => {
    const newBoardName = prompt("Enter name for the new board:");
    if (newBoardName && newBoardName.trim()) {
        onAddBoard(newBoardName.trim());
    } else if (newBoardName !== null) {
        // Consider using a custom modal for alerts if `alert()` is problematic
        console.warn("Board name cannot be empty."); // Using console for now
    }
    setIsBoardDropdownOpen(false);
  };

  const internalHandleSelectBoard = (boardId) => {
    if (activeBoard?.id !== boardId) onSelectBoard(boardId);
    setIsBoardDropdownOpen(false);
  };
  const internalHandleRenameBoardClick = (boardId, currentName, e) => {
    e.stopPropagation(); setEditingBoardId(boardId); setNewBoardNameInput(currentName); setIsEditingBoardName(true);
  };
  const internalSaveBoardName = () => {
    if (editingBoardId && newBoardNameInput.trim()) {
        onRenameBoard(editingBoardId, newBoardNameInput.trim());
    } else if (newBoardNameInput.trim()==='') {
        console.warn("Board name cannot be empty.");
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
    onDeleteBoard(boardId);
    if (editingBoardId === boardId) { setIsEditingBoardName(false); setEditingBoardId(null); }
  };

  const internalHandleSelectPhase = (phaseId) => {
    onSelectPhase(phaseId);
    setIsPhaseDropdownOpen(false);
  };

  const internalHandleAddPhase = (e) => {
    e.stopPropagation();
    const newPhaseName = prompt("Enter name for the new phase:");
    if (newPhaseName && newPhaseName.trim()) {
      onAddPhase(newPhaseName.trim());
    } else if (newPhaseName !== null) {
      console.warn("Phase name cannot be empty.");
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
      onRenamePhase(editingPhaseId, newPhaseNameInput.trim());
    } else if (newPhaseNameInput.trim() === '') {
      console.warn("Phase name cannot be empty.");
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
    onDeletePhase(phaseId);
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
        if (typeof onLoadMarkdown === 'function') onLoadMarkdown(content);
        else console.error("onLoadMarkdown is not a function");
      };
      reader.readAsText(file);
    } else if (file) {
      console.warn("Please select a valid Markdown (.md) file.");
    }
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  let currentPhaseName = "No Phases";
  if (activeBoard) {
    if (activeBoardPhases && activeBoardPhases.length > 0) {
        const currentActivePhaseDetails = activeBoardPhases.find(p => p.id === activePhaseId);
        if (currentActivePhaseDetails) {
            currentPhaseName = currentActivePhaseDetails.name;
        } else if (activeBoardPhases.length > 0) {
             currentPhaseName = activeBoardPhases[0].name;
        } else {
            currentPhaseName = "Add Phase";
        }
    } else {
        currentPhaseName = "Add Phase";
    }
  }

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full sticky top-0 z-40"
      style={{
        // Using --bg-primary which is theme-aware
        backgroundColor: 'var(--bg-primary)', 
        borderBottom: '3px solid var(--cartoon-border-dark)',
        boxShadow: '0px 4px 0px var(--cartoon-header-shadow)',
        fontFamily: 'var(--cartoon-font)',
      }}
    >
      <div className="flex items-center justify-between w-full px-4 py-3">
        <div className="flex items-center gap-3 md:gap-4 flex-wrap">
          <h1
            className="text-3xl md:text-3xl font-black mr-2 md:mx-2 mt-1 tracking-tighter cursor-default select-none"
            style={{ color: 'var(--text-heading)', fontFamily: 'var(--cartoon-font)' }} // --text-heading is theme-aware
          >
            TaskMD Pro
          </h1>

          <div className="relative" ref={boardDropdownRef}>
            <motion.button
              onClick={toggleBoardDropdown}
              disabled={boards.length === 0 && !activeBoard}
              className={`${headerDropdownButtonBaseClass} ${headerButtonMinWidth}`}
            >
              <span className={`truncate ${headerButtonTextMaxWidth}`}>
                {activeBoard ? activeBoard.name : (boards.length > 0 ? 'Select Board' : 'No Boards')}
              </span>
              {isBoardDropdownOpen ? <FaAngleUp /> : <FaAngleDown />}
            </motion.button>
            {isBoardDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`absolute top-full left-0 mt-2 w-full ${headerButtonMinWidth} max-h-72 overflow-y-auto z-50`}
                style={{
                    // Using theme-aware variable for dropdown background
                    backgroundColor: 'var(--bg-component-explicit-white)', 
                    border: '3px solid var(--cartoon-border-dark)',
                    borderRadius: '15px',
                    boxShadow: '4px 4px 0px var(--cartoon-shadow-color)',
                }}
              >
                <ul className="py-1">
                  {boards.map((board) => (
                    <motion.li
                      key={board.id}
                      variants={dropdownItemVariants} whileHover="hover"
                      // Using CSS variables for text and active background
                      className={`px-3 py-2.5 cursor-pointer flex items-center justify-between text-sm font-semibold group 
                                  ${activeBoard?.id === board.id ? 'bg-[var(--bg-secondary)] text-[var(--cartoon-primary)]' : 'text-[var(--text-primary)]'}`}
                      style={{ fontFamily: 'var(--cartoon-font)'}}
                    >
                      {isEditingBoardName && editingBoardId === board.id ? (
                        <input ref={editInputRef} type="text" value={newBoardNameInput} onChange={(e) => setNewBoardNameInput(e.target.value)} onBlur={internalSaveBoardName} onKeyDown={internalHandleEditInputKeyDown} onClick={(e) => e.stopPropagation()} className="input-base text-sm py-1.5 px-2.5 w-full mr-2 flex-grow"/>
                      ) : (
                        <span onClick={() => internalHandleSelectBoard(board.id)} className="truncate flex-grow block py-0.5">{board.name}</span>
                      )}
                      {(!isEditingBoardName || editingBoardId !== board.id) && (
                        <div className="flex items-center flex-shrink-0 ml-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100">
                          <button onClick={(e) => internalHandleRenameBoardClick(board.id, board.name, e)} className="action-btn p-1.5 text-xs" title="Rename board"><FaEdit /></button>
                          {boards.length > 1 && (<button onClick={(e) => internalHandleDeleteBoard(board.id, e)} className="action-btn action-btn-delete p-1.5 text-xs" title="Delete board"><FaTrash /></button>)}
                        </div>
                      )}
                    </motion.li>
                  ))}
                  <li className="border-t-[2.5px] border-cartoon-border-dark mt-1 pt-1">
                    <motion.button variants={dropdownItemVariants} whileHover="hover" onClick={handleAddBoard} className="w-full text-left px-3 py-2.5 text-sm font-semibold flex items-center gap-2" style={{color: 'var(--cartoon-green)', fontFamily: 'var(--cartoon-font)'}}>
                      <FaPlus /> Add New Board
                    </motion.button>
                  </li>
                </ul>
              </motion.div>
            )}
          </div>

          {activeBoard && (
            <div className="relative" ref={phaseDropdownRef}>
              <motion.button
                onClick={togglePhaseDropdown}
                disabled={!activeBoardPhases || activeBoardPhases.length === 0}
                className={`${headerDropdownButtonBaseClass} ${headerButtonMinWidth}`}
              >
                <span className={`truncate ${headerButtonTextMaxWidth}`}>{currentPhaseName}</span>
                {isPhaseDropdownOpen ? <FaAngleUp /> : <FaAngleDown />}
              </motion.button>
              {isPhaseDropdownOpen && activeBoardPhases && activeBoardPhases.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`absolute top-full left-0 mt-2 w-full ${headerButtonMinWidth} max-h-72 overflow-y-auto z-50`}
                  style={{
                     // Using theme-aware variable for dropdown background
                    backgroundColor: 'var(--bg-component-explicit-white)',
                    border: '3px solid var(--cartoon-border-dark)',
                    borderRadius: '15px',
                    boxShadow: '4px 4px 0px var(--cartoon-shadow-color)',
                  }}
                >
                  <ul className="py-1">
                    {(activeBoardPhases || []).map((phase) => (
                      <motion.li
                        key={phase.id}
                        variants={dropdownItemVariants} whileHover="hover"
                        // Using CSS variables for text and active background
                        className={`px-3 py-2.5 cursor-pointer text-sm font-semibold flex items-center justify-between group 
                                    ${activePhaseId === phase.id ? 'bg-[var(--bg-secondary)] text-[var(--cartoon-primary)]' : 'text-[var(--text-primary)]'}`}
                        style={{ fontFamily: 'var(--cartoon-font)'}}
                      >
                        {isEditingPhaseName && editingPhaseId === phase.id ? (
                          <input ref={phaseEditInputRef} type="text" value={newPhaseNameInput} onChange={(e) => setNewPhaseNameInput(e.target.value)} onBlur={internalSavePhaseName} onKeyDown={internalHandlePhaseEditInputKeyDown} onClick={(e) => e.stopPropagation()} className="input-base text-sm py-1.5 px-2.5 w-full mr-2 flex-grow" />
                        ) : (
                          <span onClick={() => internalHandleSelectPhase(phase.id)} className="truncate flex-grow block py-0.5">{phase.name}</span>
                        )}
                        {(!isEditingPhaseName || editingPhaseId !== phase.id) && (
                          <div className="flex items-center flex-shrink-0 ml-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150">
                            <button onClick={(e) => internalHandleRenamePhaseClick(phase.id, phase.name, e)} className="action-btn p-1.5 text-xs" title="Rename phase"><FaEdit /></button>
                            {activeBoardPhases.length > 1 && (
                                 <button onClick={(e) => internalHandleDeletePhase(phase.id, e)} className="action-btn action-btn-delete p-1.5 text-xs" title="Delete phase"><FaTrash /></button>
                            )}
                          </div>
                        )}
                      </motion.li>
                    ))}
                    <li className="border-t-[2.5px] border-cartoon-border-dark mt-1 pt-1">
                      <motion.button variants={dropdownItemVariants} whileHover="hover" onClick={internalHandleAddPhase} className="w-full text-left px-3 py-2.5 text-sm font-semibold flex items-center gap-2" style={{color: 'var(--cartoon-green)', fontFamily: 'var(--cartoon-font)'}}>
                        <FaPlus /> Add New Phase
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
              className="btn btn-secondary px-3 py-2 text-sm cursor-pointer flex items-center gap-1.5"
              title="Load tasks from .MD file into current board"
            >
              <FaFolderOpen /> Load MD
              <input ref={fileInputRef} type="file" id="md-upload" accept=".md" className="hidden" onChange={internalHandleFileChange} />
            </motion.label>
          )}
          
          <div
            className="relative flex items-center cursor-pointer select-none p-1"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            style={{
              border: '2px solid var(--cartoon-border-dark)',
              boxShadow: '2px 2px 0px var(--cartoon-shadow-color)',
              borderRadius: '30px',
              width: '56px', 
              height: '32px',
            }}
          >
            <motion.div 
              className="w-full h-full rounded-full"
              style={{
                // Theme-aware background for the toggle track
                backgroundColor: theme === 'dark' ? 'var(--cartoon-secondary)' : 'var(--cartoon-border-medium)',
                border: '2px solid var(--cartoon-border-dark)',
                borderRadius: '28px',
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
                  width: '20px',
                  height: '20px',
                  // Explicitly white thumb, as per cartoon style guide for toggle thumb
                  backgroundColor: 'var(--cartoon-text-light)', 
                  border: '1px solid var(--cartoon-border-dark)',
                  // Corrected x position calculation for dark mode
                  x: theme === 'dark' ? '28px' : '2px', 
                }}
                layout
                transition={{ type: 'spring', stiffness: 600, damping: 25 }}
              >
              </motion.span>
            </motion.div>
          </div>

          <button
            className="action-btn text-xl flex items-center justify-center"
            title="Info"
            onClick={() => setInfoOpen(true)}
            type="button"
          >
            <FaInfoCircle />
          </button>
          <InfoModal open={infoOpen} onClose={closeInfoModal} />
        </div>
      </div>
    </motion.header>
  );
});
export default Header;