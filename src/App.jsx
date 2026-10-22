import { useState, useEffect } from 'react';
import './App.css';

import Navbar from './components/Navbar';
import Taskform from './components/Taskform';
import TaskList from './components/TaskList';
import TaskFilters from './components/TaskFilters';
import DashboardStats from './components/DashboardStats';
import TaskBoard from './components/TaskBoard';
import { getDateString } from './utils/dates';
import { generateSampleTasks } from './utils/sampleData';

const validStatuses = ['todo', 'in-progress', 'done'];

function withStatus(task, status) {
    return {
        ...task,
        status,
        completed: status === 'done',
        completedAt: status === 'done' ? getDateString() : null
    };
}

function loadTasks() {
    try {
        const saved = localStorage.getItem('tasks');

        if (saved === null) {
            return generateSampleTasks();
        }

        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
            return parsed.map((task) => {
                const status = task.status || (task.completed ? 'done' : 'todo');

                return {
                    ...task,
                    status,
                    completed: status === 'done',
                    dueDate: task.dueDate || ''
                };
            });
        }
    } catch {
        console.error('Could not load saved tasks.');
    }

    return [];
}

function loadTheme() {
    try {
        const saved = localStorage.getItem('theme');

        if (saved === 'light' || saved === 'dark') return saved;
    } catch {
        console.error('Could not read saved theme.');
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function App() {
    const [tasks, setTasks] = useState(loadTasks);
    const [theme, setTheme] = useState(loadTheme);
    const [filter, setFilter] = useState('all');
    const [activePage, setActivePage] = useState('dashboard');
    const [sortPriority, setSortPriority] = useState('default');
    const [viewMode, setViewMode] = useState('board');
    const [searchQuery, setSearchQuery] = useState('');
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        try {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        } catch {
            console.error('Could not save tasks.');
        }
    }, [tasks]);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);

        try {
            localStorage.setItem('theme', theme);
        } catch {
            console.error('Could not save theme.');
        }
    }, [theme]);

    const filteredTasks = tasks.filter((task) => {
        const matchesFilter =
            filter === 'all' ||
            (filter === 'active' && !task.completed) ||
            (filter === 'completed' && task.completed);

        const matchesSearch = task.title
            .toLowerCase()
            .includes(searchQuery.trim().toLowerCase());

        return matchesFilter && matchesSearch;
    });

    const priorityOrder = { High: 3, Medium: 2, Low: 1 };

    const sortedTasks = [...filteredTasks].sort((a, b) => {
        const priorityA = priorityOrder[a.priority || 'Medium'] || 2;
        const priorityB = priorityOrder[b.priority || 'Medium'] || 2;

        if (sortPriority === 'high-to-low') return priorityB - priorityA;
        if (sortPriority === 'low-to-high') return priorityA - priorityB;

        return 0;
    });

    function addTask(title, priority, dueDate) {
        const newTask = {
            id: Date.now(),
            title,
            completed: false,
            priority: priority || 'Medium',
            dueDate: dueDate || '',
            status: 'todo',
            createdAt: getDateString(),
            completedAt: null
        };

        setTasks((previous) => [...previous, newTask]);
    }

    function deleteTask(idToDelete) {
        setTasks((previous) => previous.filter((task) => task.id !== idToDelete));
    }

    function clearCompleted() {
        setTasks((previous) => previous.filter((task) => !task.completed));
    }

    function toggleTask(id) {
        setTasks((previous) =>
            previous.map((task) =>
                task.id === id
                    ? withStatus(task, task.completed ? 'todo' : 'done')
                    : task
            )
        );
    }

    function editTask(id, newTitle) {
        setTasks((previous) =>
            previous.map((task) =>
                task.id === id ? { ...task, title: newTitle } : task
            )
        );
    }

    function updateTaskStatus(id, newStatus) {
        if (!validStatuses.includes(newStatus)) return;

        setTasks((previous) =>
            previous.map((task) =>
                task.id === id ? withStatus(task, newStatus) : task
            )
        );
    }

    function clearSample() {
        setTasks((previous) => previous.filter((task) => !task.isSample));
    }

    function loadSample() {
        setTasks((previous) => [
            ...previous.filter((task) => !task.isSample),
            ...generateSampleTasks()
        ]);
    }

    function openNewTask() {
        setActivePage('tasks');
        setShowForm(true);
    }

    const completedTasks = tasks.filter((task) => task.completed).length;
    const totalTasks = tasks.length;
    const remainingTasks = totalTasks - completedTasks;
    const hasSample = tasks.some((task) => task.isSample);

    const todayLabel = new Date().toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });

    return (
        <div className="app">
            <Navbar
                activePage={activePage}
                setActivePage={setActivePage}
                theme={theme}
                onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                onNewTask={openNewTask}
            />

            <main className="page-shell">
                {hasSample && (
                    <div className="sample-banner" role="status">
                        <p>This is sample data. Clear it to start your own dashboard.</p>

                        <button type="button" className="btn" onClick={clearSample}>
                            Clear sample data
                        </button>
                    </div>
                )}

                {activePage === 'dashboard' && (
                    <>
                        <header className="page-heading">
                            <h1>Overview</h1>
                            <p className="page-sub">
                                {todayLabel}. {remainingTasks} {remainingTasks === 1 ? 'task' : 'tasks'} still open.
                            </p>
                        </header>

                        {totalTasks === 0 ? (
                            <section className="panel empty-dashboard">
                                <h2 className="panel-title">Start your first task</h2>

                                <p className="panel-note">
                                    Your overview fills in as you add and finish tasks.
                                </p>

                                <div className="empty-actions">
                                    <button type="button" className="btn btn-primary" onClick={openNewTask}>
                                        Add a task
                                    </button>

                                    <button type="button" className="btn" onClick={loadSample}>
                                        Load sample data
                                    </button>
                                </div>
                            </section>
                        ) : (
                            <DashboardStats
                                tasks={tasks}
                                totalTasks={totalTasks}
                                completedTasks={completedTasks}
                                remainingTasks={remainingTasks}
                                onOpenTasks={() => setActivePage('tasks')}
                            />
                        )}
                    </>
                )}

                {activePage === 'tasks' && (
                    <>
                        <header className="page-heading">
                            <h1>My tasks</h1>
                            <p className="page-sub">
                                {totalTasks} {totalTasks === 1 ? 'task' : 'tasks'} in total, {remainingTasks} still open.
                            </p>
                        </header>

                        {showForm && (
                            <Taskform
                                onAddTask={addTask}
                                onClose={() => setShowForm(false)}
                            />
                        )}

                        <TaskFilters
                            filter={filter}
                            setFilter={setFilter}
                            sortPriority={sortPriority}
                            setSortPriority={setSortPriority}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            viewMode={viewMode}
                            setViewMode={setViewMode}
                            hasCompleted={completedTasks > 0}
                            onClearCompleted={clearCompleted}
                        />

                        {viewMode === 'board' ? (
                            <TaskBoard
                                tasks={sortedTasks}
                                onUpdateStatus={updateTaskStatus}
                                onDeleteTask={deleteTask}
                            />
                        ) : (
                            <TaskList
                                tasks={sortedTasks}
                                totalTasks={totalTasks}
                                filter={filter}
                                onToggleTask={toggleTask}
                                onDeleteTask={deleteTask}
                                onEditTask={editTask}
                            />
                        )}
                    </>
                )}
            </main>
        </div>
    );
}

export default App;