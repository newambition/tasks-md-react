// src/components/InfoModal.js
import React from "react";
import ModalOverlay from "./ModalOverlay";
import ModalContent from "./ModalContent";

const InfoModal = React.memo(({ open, onClose }) => {
  if (!open) return null;

  return (
    <ModalOverlay onClose={onClose}>
      <ModalContent onClose={onClose} />
    </ModalOverlay>
  );
});

export default InfoModal;
