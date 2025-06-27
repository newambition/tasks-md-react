
import { useState, useRef, useEffect } from 'react';

const useTaskCardEditing = (task, onUpdateTaskDueDate, onUpdateTask, onExpand) => {
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [currentDueDate, setCurrentDueDate] = useState(task?.dueDate || '');
  const [editedText, setEditedText] = useState(task?.text || '');
  const dateInputRef = useRef(null);
  const textInputRef = useRef(null);

  useEffect(() => {
    if (task) {
      setEditedText(task.text);
      setCurrentDueDate(task.dueDate || '');
    }
  }, [task]);

  useEffect(() => {
    if (isEditingDate && dateInputRef.current) {
      dateInputRef.current.focus();
    }
  }, [isEditingDate]);

  const convertToInputFormat = (ddmmyy) => {
    if (!ddmmyy) return '';
    try {
      const [day, month, year] = ddmmyy.split('-');
      const fullYear = 2000 + parseInt(year, 10);
      return `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    } catch (e) {
      console.error('Error converting date to input format:', ddmmyy, e);
      return '';
    }
  };

  const convertFromInputFormat = (yyyymmdd) => {
    if (!yyyymmdd) return null;
    try {
      const [year, month, day] = yyyymmdd.split('-');
      const shortYear = parseInt(year, 10) - 2000;
      return `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${shortYear
        .toString()
        .padStart(2, '0')}`;
    } catch (e) {
      console.error('Error converting date from input format:', yyyymmdd, e);
      return null;
    }
  };

  const handleDateChange = (e) => setCurrentDueDate(e.target.value);

  const internalHandleDateClick = (e) => {
    e.stopPropagation();
    setCurrentDueDate(convertToInputFormat(task.dueDate || ''));
    setIsEditingDate(true);
  };

  const internalSaveDate = () => {
    const newDate = convertFromInputFormat(currentDueDate);
    if (task && newDate !== task.dueDate) {
      onUpdateTaskDueDate(task.id, newDate);
    }
    setIsEditingDate(false);
  };

  const internalHandleDateBlur = () => {
    internalSaveDate();
  };

  const internalHandleDateKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      internalSaveDate();
    } else if (e.key === 'Escape') {
      setIsEditingDate(false);
      setCurrentDueDate(convertToInputFormat(task?.dueDate || ''));
    }
  };

  const handleSave = () => {
    if (editedText.trim() !== task.text) {
      onUpdateTask(task.id, { text: editedText.trim() });
    }
    onExpand();
  };

  return {
    isEditingDate,
    currentDueDate,
    editedText,
    setEditedText,
    dateInputRef,
    textInputRef,
    handleDateChange,
    internalHandleDateClick,
    internalHandleDateBlur,
    internalHandleDateKeyDown,
    handleSave,
  };
};

export default useTaskCardEditing;
