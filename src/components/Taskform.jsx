import { useState } from 'react';
import './Taskform.css';

function Taskform({ onAddTask, onClose }) {
    const [input, setInput] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [dueDate, setDueDate] = useState('');

    function handleSubmit(e) {
        e.preventDefault();

        if (input.trim() === '') return;

        onAddTask(input.trim(), priority, dueDate);

        setInput('');
        setPriority('Medium');
        setDueDate('');
    }

    return (
        <form className="panel task-form" onSubmit={handleSubmit}>
            <h2 className="panel-title">New task</h2>

            <div className="task-form-row">
                <input
                    type="text"
                    className="field"
                    placeholder="Finish the two-sum problem"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    aria-label="Task title"
                    autoFocus
                    required
                />

                <select
                    className="field"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    aria-label="Task priority"
                >
                    <option value="Low">Low priority</option>
                    <option value="Medium">Medium priority</option>
                    <option value="High">High priority</option>
                </select>

                <input
                    type="date"
                    className="field"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    aria-label="Due date"
                />

                <div className="task-form-actions">
                    <button type="submit" className="btn btn-primary">
                        Add task
                    </button>

                    <button type="button" className="btn btn-ghost" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </form>
    );
}

export default Taskform;
