
import { useState, useRef, useEffect } from 'react';

export const useEditableItem = (initialName, onSaveCallback) => {
  const [isEditing, setIsEditing] = useState(false);
  const [itemName, setItemName] = useState(initialName);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const startEditing = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const saveEditing = () => {
    if (itemName.trim()) {
      onSaveCallback(itemName.trim());
    }
    setIsEditing(false);
  };

  const cancelEditing = () => {
    setItemName(initialName); // Revert to original name
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveEditing();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  return {
    isEditing,
    itemName,
    setItemName,
    inputRef,
    startEditing,
    saveEditing,
    cancelEditing,
    handleKeyDown,
  };
};
