

import React from 'react';

const exampleMarkdown = `# My Project Plan\nSome introductory text.\n\n## Phase 1: Kickoff\n- [ ] Schedule kickoff meeting (10-05-25)\n- [x] Prepare agenda (09-05-25)\n\n## Phase 2: Research\n- [ ] User interviews\n- [ ] Competitor analysis (20-05-25) [review(#06d6a0)]\n`;

const ModalContent = ({ onClose }) => {
  return (
    <div
      className="bg-white w-full max-w-lg mx-auto p-6 relative rounded-[15px] border-[3px] border-solid border-cartoon-border-dark shadow-[5px_5px_0px_var(--cartoon-shadow-color)] animate-fadeIn"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center border-2 border-solid border-cartoon-border-dark text-cartoon-text bg-cartoon-bg-medium shadow-[1.5px_1.5px_0px_var(--cartoon-border-dark)] hover:bg-cartoon-secondary hover:text-cartoon-text-light active:translate-x-[0.5px] active:translate-y-[0.5px] active:shadow-[1px_1px_0px_var(--cartoon-border-dark)] transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-cartoon-primary ring-offset-2 ring-offset-white"
        onClick={onClose}
        aria-label="Close info modal"
      >
        <span className="text-xl font-bold leading-none">&times;</span>
      </button>
      <h2
        className="text-xl font-extrabold mb-4 pb-3 border-b-2"
        style={{
          color: "var(--cartoon-primary)",
          borderColor: "var(--cartoon-border-medium)",
        }}
      >
        How to Use Tasks.md Kanban
      </h2>
      <p className="mb-4 text-sm" style={{ color: "var(--cartoon-text)" }}>
        You can use this Kanban board manually, or by uploading a{" "}
        <span className="font-mono text-xs p-0.5 bg-cartoon-bg-medium rounded border border-cartoon-border-medium">
          .md
        </span>{" "}
        tasklist in GitHub tasks format—with the addition of <b>phases</b>.
      </p>
      <p
        className="mb-2 text-sm font-semibold"
        style={{ color: "var(--cartoon-text)" }}
      >
        Example Markdown:
      </p>
      <pre
        className="text-xs rounded-xl p-3.5 overflow-x-auto mb-4 border-2 whitespace-pre-wrap"
        style={{
          backgroundColor: "var(--cartoon-bg-medium)",
          borderColor: "var(--cartoon-border-dark)",
          boxShadow:
            "inset 2px 2px 0px var(--cartoon-border-medium), 2px 2px 0px var(--cartoon-shadow-color)",
          color: "var(--cartoon-text)",
        }}
      >
        {exampleMarkdown}
      </pre>
      <ul
        className="list-disc pl-5 text-sm space-y-1 mb-3"
        style={{ color: "var(--cartoon-text)" }}
      >
        <li>
          <span className="font-mono text-xs p-0.5 bg-cartoon-bg-medium rounded border border-cartoon-border-medium">
            #
          </span>{" "}
          Level 1 headings become <b>Spaces</b>
        </li>
        <li>
          <span className="font-mono text-xs p-0.5 bg-cartoon-bg-medium rounded border border-cartoon-border-medium">
            ##
          </span>{" "}
          Level 2 headings become <b>Phases</b>
        </li>
        <li>
          <span className="font-mono text-xs p-0.5 bg-cartoon-bg-medium rounded border border-cartoon-border-medium">
            - [ ]
          </span>{" "}
          and{" "}
          <span className="font-mono text-xs p-0.5 bg-cartoon-bg-medium rounded border border-cartoon-border-medium">
            - [x]
          </span>{" "}
          lines become <b>Tasks</b>
        </li>
        <li>
          <span className="font-mono text-xs p-0.5 bg-cartoon-bg-medium rounded border border-cartoon-border-medium">
            (DD-MM-YY)
          </span>{" "}
          become <b>Due Dates</b>
        </li>
        <li>
          <span className="font-mono text-xs p-0.5 bg-cartoon-bg-medium rounded border border-cartoon-border-medium">
            [label(#color)]
          </span>{" "}
          become <b>Labels</b> with color being optional
        </li>
      </ul>
      <p
        className="text-xs mt-3"
        style={{ color: "var(--cartoon-border-medium)" }}
      >
        Only Tasks are required to populate the board, the rest is optional.
      </p>
    </div>
  );
};

export default ModalContent;
