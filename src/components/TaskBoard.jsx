import {
    DndContext,
    PointerSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
    useDroppable,
    closestCorners
} from '@dnd-kit/core';
import {
    SortableContext,
    useSortable,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X, CalendarDays } from 'lucide-react';
import { dueLabel } from '../utils/dates';
import './TaskBoard.css';

const columns = [
    { id: 'todo', title: 'To do', color: 'var(--text-tertiary)' },
    { id: 'in-progress', title: 'In progress', color: 'var(--accent)' },
    { id: 'done', title: 'Done', color: 'var(--success)' }
];

const nextStatus = {
    todo: 'in-progress',
    'in-progress': 'done',
    done: 'todo'
};

const DONE_LIMIT = 6;

const actionLabel = {
    todo: 'Start',
    'in-progress': 'Mark done',
    done: 'Reopen'
};

function getStatus(task) {
    return task.status || (task.completed ? 'done' : 'todo');
}

function SortableTask({ task, column, onUpdateStatus, onDeleteTask }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: String(task.id),
        data: { type: 'task', status: column.id }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1
    };

    const priority = task.priority || 'Medium';
    const due = task.completed ? null : dueLabel(task.dueDate);

    return (
        <article ref={setNodeRef} style={style} className="kanban-task">
            <div className="kanban-task-tools">
                <button
                    type="button"
                    className="icon-btn kanban-grip"
                    aria-label={`Drag ${task.title}`}
                    {...attributes}
                    {...listeners}
                >
                    <GripVertical size={16} strokeWidth={1.8} />
                </button>

                <button
                    type="button"
                    className="icon-btn danger"
                    onClick={() => onDeleteTask(task.id)}
                    aria-label={`Delete ${task.title}`}
                >
                    <X size={16} strokeWidth={1.8} />
                </button>
            </div>

            {priority !== 'Medium' && (
                <span className={`label kanban-label priority-${priority.toLowerCase()}`}>
                    {priority}
                </span>
            )}

            <h3
                className={[
                    'kanban-task-title',
                    task.completed ? 'is-completed' : '',
                    priority === 'Medium' ? 'reserve-tools' : ''
                ].join(' ').trim()}
            >
                {task.title}
            </h3>

            {due && (
                <p className={`kanban-due is-${due.state}`}>
                    <CalendarDays size={14} strokeWidth={1.8} aria-hidden="true" />
                    {due.text}
                </p>
            )}

            <button
                type="button"
                className="link-btn kanban-next"
                onClick={() => onUpdateStatus(task.id, nextStatus[column.id])}
            >
                {actionLabel[column.id]}
            </button>
        </article>
    );
}

function DroppableColumn({ column, tasks, hiddenCount, onUpdateStatus, onDeleteTask }) {
    const { setNodeRef, isOver } = useDroppable({
        id: `column-${column.id}`,
        data: { type: 'column', status: column.id }
    });

    return (
        <section
            ref={setNodeRef}
            className={isOver ? 'kanban-column kanban-column-over' : 'kanban-column'}
        >
            <div className="kanban-column-header">
                <span className="kanban-status-dot" style={{ backgroundColor: column.color }} />
                <h2>{column.title}</h2>
                <span className="kanban-count">{tasks.length + hiddenCount}</span>
            </div>

            <SortableContext
                items={tasks.map((task) => String(task.id))}
                strategy={verticalListSortingStrategy}
            >
                <div className="kanban-column-content">
                    {tasks.length === 0 ? (
                        <p className="kanban-empty">Drag a task here</p>
                    ) : (
                        tasks.map((task) => (
                            <SortableTask
                                key={task.id}
                                task={task}
                                column={column}
                                onUpdateStatus={onUpdateStatus}
                                onDeleteTask={onDeleteTask}
                            />
                        ))
                    )}
                </div>
            </SortableContext>

            {hiddenCount > 0 && (
                <p className="kanban-more">
                    {hiddenCount} older done {hiddenCount === 1 ? 'task is' : 'tasks are'} hidden.
                    Open List view to see all.
                </p>
            )}
        </section>
    );
}

function TaskBoard({ tasks, onUpdateStatus, onDeleteTask }) {
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    function handleDragEnd(event) {
        const { active, over } = event;

        if (!over) return;

        const draggedTask = tasks.find((task) => String(task.id) === String(active.id));

        if (!draggedTask) return;

        let targetStatus = null;

        if (String(over.id).startsWith('column-')) {
            targetStatus = String(over.id).slice('column-'.length);
        } else {
            const targetTask = tasks.find((task) => String(task.id) === String(over.id));

            if (targetTask) {
                targetStatus = getStatus(targetTask);
            }
        }

        const isValidStatus = columns.some((column) => column.id === targetStatus);

        if (isValidStatus && targetStatus !== getStatus(draggedTask)) {
            onUpdateStatus(draggedTask.id, targetStatus);
        }
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
        >
            <p className="board-hint">
                Drag a card by its handle, or use the link at the bottom of each card.
            </p>

            <div className="kanban-board">
                {columns.map((column) => {
                    let columnTasks = tasks.filter((task) => getStatus(task) === column.id);
                    let hiddenCount = 0;

                    if (column.id === 'done') {
                        columnTasks = [...columnTasks].sort((a, b) =>
                            (b.completedAt || '').localeCompare(a.completedAt || '')
                        );
                        hiddenCount = Math.max(columnTasks.length - DONE_LIMIT, 0);
                        columnTasks = columnTasks.slice(0, DONE_LIMIT);
                    }

                    return (
                        <DroppableColumn
                            key={column.id}
                            column={column}
                            tasks={columnTasks}
                            hiddenCount={hiddenCount}
                            onUpdateStatus={onUpdateStatus}
                            onDeleteTask={onDeleteTask}
                        />
                    );
                })}
            </div>
        </DndContext>
    );
}

export default TaskBoard;