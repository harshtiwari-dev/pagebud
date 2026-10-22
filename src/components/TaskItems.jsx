import { useState } from 'react';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { dueLabel } from '../utils/dates';
import './TaskItems.css';

function TaskItem({ task, onToggleTask, onEditTask, onDeleteTask }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(task.title);

    const priority = task.priority || 'Medium';
    const due = task.completed ? null : dueLabel(task.dueDate);

    function saveEdit() {
        const title = editedTitle.trim();

        if (title === '') return;

        onEditTask(task.id, title);
        setIsEditing(false);
    }

    function cancelEdit() {
        setEditedTitle(task.title);
        setIsEditing(false);
    }

    return (
        <li className="task-row">
            <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggleTask(task.id)}
                aria-label={`Mark ${task.title} as done`}
            />

            <div className="task-main">
                {isEditing ? (
                    <input
                        type="text"
                        className="field"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEdit();
                            if (e.key === 'Escape') cancelEdit();
                        }}
                        aria-label="Edit task title"
                        autoFocus
                    />
                ) : (
                    <>
                        <span className={task.completed ? 'task-text completed' : 'task-text'}>
                            {task.title}
                        </span>

                        {due && (
                            <span className={`task-due is-${due.state}`}>{due.text}</span>
                        )}
                    </>
                )}
            </div>

            {!isEditing && priority !== 'Medium' && (
                <span className={`label priority-${priority.toLowerCase()}`}>{priority}</span>
            )}

            <div className="task-actions">
                {isEditing ? (
                    <>
                        <button type="button" className="icon-btn" onClick={saveEdit} aria-label="Save changes">
                            <Check size={18} strokeWidth={1.8} />
                        </button>

                        <button type="button" className="icon-btn" onClick={cancelEdit} aria-label="Cancel editing">
                            <X size={18} strokeWidth={1.8} />
                        </button>
                    </>
                ) : (
                    <button
                        type="button"
                        className="icon-btn"
                        onClick={() => {
                            setEditedTitle(task.title);
                            setIsEditing(true);
                        }}
                        aria-label={`Edit ${task.title}`}
                    >
                        <Pencil size={17} strokeWidth={1.8} />
                    </button>
                )}

                <button
                    type="button"
                    className="icon-btn danger"
                    onClick={() => onDeleteTask(task.id)}
                    aria-label={`Delete ${task.title}`}
                >
                    <Trash2 size={17} strokeWidth={1.8} />
                </button>
            </div>
        </li>
    );
}

export default TaskItem;
