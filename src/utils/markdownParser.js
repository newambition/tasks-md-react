// src/utils/markdownParser.js
import { generateUniqueId } from './helpers';

const DUE_DATE_REGEX = /\((\d{4}-\d{2}-\d{2})\)/; // Matches (YYYY-MM-DD)

export const parseMarkdown = (markdownContent) => {
    const lines = markdownContent.split('\n');
    const parsedPhases = [];
    const parsedTasks = [];
    let currentPhaseId = null;
    let phaseOrder = 0; // To maintain order if needed, though not strictly used in current board display

    // Create a default "Uncategorized" phase for tasks found before any ## Phase heading
    const defaultPhaseId = generateUniqueId('phase');
    let defaultPhaseAdded = false;


    lines.forEach(line => {
        const trimmedLine = line.trim();

        // Match Phase Headers (## Phase Name)
        if (trimmedLine.startsWith('## ')) {
            const phaseName = trimmedLine.substring(3).trim();
            if (phaseName) {
                currentPhaseId = generateUniqueId('phase');
                parsedPhases.push({
                    id: currentPhaseId,
                    name: phaseName,
                    order: phaseOrder++,
                });
            }
        }
        // Match Tasks (- [ ] or - [x])
        else if (trimmedLine.startsWith('- [ ]') || trimmedLine.startsWith('- [x]')) {
            let taskText = trimmedLine.substring(5).trim();
            const status = trimmedLine.startsWith('- [x]') ? 'done' : 'todo';
            let dueDate = null;

            const dateMatch = taskText.match(DUE_DATE_REGEX);
            if (dateMatch && dateMatch[1]) {
                dueDate = dateMatch[1];
                taskText = taskText.replace(DUE_DATE_REGEX, '').trim(); // Remove date from text
            }

            if (taskText) {
                let taskPhaseId = currentPhaseId;
                if (!taskPhaseId) { // Task found before any phase definition
                    if (!defaultPhaseAdded) {
                        parsedPhases.push({
                            id: defaultPhaseId,
                            name: 'Uncategorized Tasks', // Or 'General', 'Default'
                            order: -1, // Or manage order differently
                        });
                        defaultPhaseAdded = true;
                    }
                    taskPhaseId = defaultPhaseId;
                }

                parsedTasks.push({
                    id: generateUniqueId('task'),
                    phaseId: taskPhaseId,
                    text: taskText,
                    status: status,
                    dueDate: dueDate,
                });
            }
        }
        // Ignore other lines (like #, *, empty lines, etc.)
    });

    // Ensure phases are sorted if order was tracked and is important
    // parsedPhases.sort((a, b) => a.order - b.order);

    return { phases: parsedPhases, tasks: parsedTasks };
};