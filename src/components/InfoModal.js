// src/components/InfoModal.js
import React from 'react'; // Ensure React is imported

const exampleMarkdown = `# My Project Plan\nSome introductory text.\n\n## Phase 1: Kickoff\n- [ ] Schedule kickoff meeting (2025-05-10)\n- [x] Prepare agenda (2025-05-09)\n\n## Phase 2: Research\n- [ ] User interviews\n- [ ] Competitor analysis (2025-05-20)\n`;

// Wrap component with React.memo
const InfoModal = React.memo(({ open, onClose }) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-bg-secondary transition-colors backdrop-blur-sm"
      onClick={onClose} // onClose should be memoized by parent (Header)
      style={{ backgroundColor: 'var(--bg-secondary)' }} // This might cause issues with memo if not stable
    >
      <div
        className="bg-bg-secondary dark:bg-bg-secondary border border-border-color rounded-lg shadow-xl max-w-lg w-full mx-4 p-6 relative animate-fadeIn"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-2xl text-text-muted hover:text-text-primary focus:outline-none"
          onClick={onClose} // onClose should be memoized by parent (Header)
          aria-label="Close info modal"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-2 text-text-heading">How to Use Tasks.md Kanban</h2>
        <p className="mb-3 text-text-primary">
          You can use this Kanban board manually, or by uploading a <span className="font-mono">.md</span> tasklist in GitHub tasks format—with the addition of <b>phases</b>.
        </p>
        <p className="mb-2 text-text-primary">Example Markdown:</p>
        <pre className="bg-gray-100 dark:bg-gray-800 text-xs rounded p-3 overflow-x-auto mb-3 border border-border-card whitespace-pre-wrap">
{exampleMarkdown}
        </pre>
        <ul className="list-disc pl-5 text-text-secondary text-sm mb-1">
          <li><span className="font-mono">##</span> headings become <b>phases</b></li>
          <li><span className="font-mono">- [ ]</span> and <span className="font-mono">- [x]</span> lines become <b>tasks</b></li>
        </ul>
        <p className="text-text-muted text-xs mt-2">Dates in parentheses are optional and will be parsed as due dates.</p>
      </div>
    </div>
  );
}); // End of React.memo

export default InfoModal;