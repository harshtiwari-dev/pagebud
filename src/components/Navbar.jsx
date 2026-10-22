import { LayoutDashboard, ListTodo, Plus, Moon, Sun } from 'lucide-react';
import Logo from './Logo';
import './Navbar.css';

function Navbar({ activePage, setActivePage, theme, onToggleTheme, onNewTask }) {
    return (
        <header className="masthead">
            <div className="masthead-inner">
                <button
                    type="button"
                    className="brand"
                    onClick={() => setActivePage('dashboard')}
                    aria-label="Pagebud, go to overview"
                >
                    <Logo size={30} />
                    <span className="brand-name">Pagebud</span>
                </button>

                <nav className="nav" aria-label="Main">
                    <button
                        type="button"
                        className="nav-link"
                        aria-current={activePage === 'dashboard' ? 'page' : undefined}
                        onClick={() => setActivePage('dashboard')}
                    >
                        <LayoutDashboard size={18} strokeWidth={1.8} aria-hidden="true" />
                        <span>Overview</span>
                    </button>

                    <button
                        type="button"
                        className="nav-link"
                        aria-current={activePage === 'tasks' ? 'page' : undefined}
                        onClick={() => setActivePage('tasks')}
                    >
                        <ListTodo size={18} strokeWidth={1.8} aria-hidden="true" />
                        <span>My tasks</span>
                    </button>
                </nav>

                <div className="masthead-actions">
                    <button
                        type="button"
                        className="icon-btn"
                        onClick={onToggleTheme}
                        aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                    >
                        {theme === 'dark'
                            ? <Sun size={18} strokeWidth={1.8} />
                            : <Moon size={18} strokeWidth={1.8} />}
                    </button>

                    <button type="button" className="btn btn-primary" onClick={onNewTask}>
                        <Plus size={17} strokeWidth={2} aria-hidden="true" />
                        <span className="btn-label">New task</span>
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Navbar;