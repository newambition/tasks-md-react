
import React, { useCallback, useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import InfoModal from './InfoModal';
import ThemeToggle from './ThemeToggle';

const HeaderActions = () => {
  const [infoOpen, setInfoOpen] = useState(false);
  const closeInfoModal = useCallback(() => setInfoOpen(false), []);

  return (
    <div className="flex items-center gap-2 md:gap-3">
      <ThemeToggle />

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
  );
};

export default HeaderActions;
