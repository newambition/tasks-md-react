
import React from 'react';

const ModalOverlay = ({ onClose, children }) => {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out animate-fadeIn"
      onClick={onClose}
      style={{
        backgroundColor: "rgba(51, 58, 122, 0.4)",
        fontFamily: "var(--cartoon-font)",
      }}
    >
      {children}
    </div>
  );
};

export default ModalOverlay;
