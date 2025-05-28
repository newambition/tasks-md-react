// src/components/InfoModal.js
import React from 'react'; // Ensure React is imported

const exampleMarkdown = `# My Project Plan\nSome introductory text.\n\n## Phase 1: Kickoff\n- [ ] Schedule kickoff meeting (2025-05-10)\n- [x] Prepare agenda (2025-05-09)\n\n## Phase 2: Research\n- [ ] User interviews\n- [ ] Competitor analysis (2025-05-20)\n`;

// Wrap component with React.memo
const InfoModal = React.memo(({ open, onClose }) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out animate-fadeIn"
      onClick={onClose}
      // Cartoon-style overlay background
      style={{ backgroundColor: 'rgba(51, 58, 122, 0.4)', fontFamily: 'var(--cartoon-font)' }}
    >
      <div
        // Cartoon-style modal panel (popup bubble)
        className="bg-white w-full max-w-lg mx-auto p-6 relative rounded-[15px] border-[3px] border-solid border-cartoon-border-dark shadow-[5px_5px_0px_var(--cartoon-shadow-color)] animate-fadeIn"
        onClick={e => e.stopPropagation()}
      >
        <button
          // Cartoon-style circular action button for close
          className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center border-2 border-solid border-cartoon-border-dark text-cartoon-text bg-cartoon-bg-medium shadow-[1.5px_1.5px_0px_var(--cartoon-border-dark)] hover:bg-cartoon-secondary hover:text-cartoon-text-light active:translate-x-[0.5px] active:translate-y-[0.5px] active:shadow-[1px_1px_0px_var(--cartoon-border-dark)] transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-cartoon-primary ring-offset-2 ring-offset-white"
          onClick={onClose}
          aria-label="Close info modal"
        >
          <span className="text-xl font-bold leading-none">&times;</span>
        </button>
        <h2 
          className="text-xl font-extrabold mb-4 pb-3 border-b-2"
          style={{ color: 'var(--cartoon-primary)', borderColor: 'var(--cartoon-border-medium)'}}
        >
          How to Use Tasks.md Kanban
        </h2>
        <p className="mb-4 text-sm" style={{ color: 'var(--cartoon-text)'}}>
          You can use this Kanban board manually, or by uploading a <span className="font-mono text-xs p-0.5 bg-cartoon-bg-medium rounded border border-cartoon-border-medium">.md</span> tasklist in GitHub tasks format—with the addition of <b>phases</b>.
        </p>
        <p className="mb-2 text-sm font-semibold" style={{ color: 'var(--cartoon-text)'}}>Example Markdown:</p>
        <pre 
          className="text-xs rounded-xl p-3.5 overflow-x-auto mb-4 border-2 whitespace-pre-wrap"
          style={{
            backgroundColor: 'var(--cartoon-bg-medium)',
            borderColor: 'var(--cartoon-border-dark)',
            boxShadow: 'inset 2px 2px 0px var(--cartoon-border-medium), 2px 2px 0px var(--cartoon-shadow-color)',
            color: 'var(--cartoon-text)'
          }}
        >
{exampleMarkdown}
        </pre>
        <ul className="list-disc pl-5 text-sm space-y-1 mb-3" style={{ color: 'var(--cartoon-text)'}}>
          <li><span className="font-mono text-xs p-0.5 bg-cartoon-bg-medium rounded border border-cartoon-border-medium">##</span> headings become <b>phases</b></li>
          <li><span className="font-mono text-xs p-0.5 bg-cartoon-bg-medium rounded border border-cartoon-border-medium">- [ ]</span> and <span className="font-mono text-xs p-0.5 bg-cartoon-bg-medium rounded border border-cartoon-border-medium">- [x]</span> lines become <b>tasks</b></li>
        </ul>
        <p className="text-xs mt-3" style={{ color: 'var(--cartoon-border-medium)'}}>Dates in parentheses are optional and will be parsed as due dates.</p>
      </div>
    </div>
  );
});

export default InfoModal;