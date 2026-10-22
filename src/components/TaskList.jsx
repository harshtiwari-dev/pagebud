import TaskItem from './TaskItems';
import './TaskList.css';

function TaskList({
    tasks,
    totalTasks,
    filter,
    onToggleTask,
    onDeleteTask,
    onEditTask
}) {
    if (tasks.length === 0) {
        return (
            <div className="panel empty-state">
                <h2 className="panel-title">
                    {totalTasks === 0 ? 'Start your first task' : 'No matching tasks'}
                </h2>

                <p className="panel-note">
                    {totalTasks === 0
                        ? 'Use New task at the top to add one.'
                        : filter === 'completed'
                            ? 'Nothing is marked done yet.'
                            : filter === 'active'
                                ? 'Every task is done.'
                                : 'Try a different search.'}
                </p>
            </div>
        );
    }

    return (
        <ul className="panel task-list">
            {tasks.map((task) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onToggleTask={onToggleTask}
                    onDeleteTask={onDeleteTask}
                    onEditTask={onEditTask}
                />
            ))}
        </ul>
    );
}

export default TaskList;
