import { Search, X } from 'lucide-react';
import './TaskFilters.css';

function TaskFilters({
    filter,
    setFilter,
    sortPriority,
    setSortPriority,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    hasCompleted,
    onClearCompleted
}) {
    return (
        <div className="tasks-toolbar">
            <div className="search">
                <Search size={17} strokeWidth={1.8} className="search-icon" aria-hidden="true" />

                <input
                    type="text"
                    className="field search-input"
                    placeholder="Search tasks"
                    aria-label="Search tasks"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                {searchQuery && (
                    <button
                        type="button"
                        className="icon-btn search-clear"
                        onClick={() => setSearchQuery('')}
                        aria-label="Clear search"
                    >
                        <X size={16} strokeWidth={1.8} />
                    </button>
                )}
            </div>

            <select
                className="field"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                aria-label="Filter tasks"
            >
                <option value="all">All tasks</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
            </select>

            <select
                className="field"
                value={sortPriority}
                onChange={(e) => setSortPriority(e.target.value)}
                aria-label="Sort by priority"
            >
                <option value="default">Default order</option>
                <option value="high-to-low">High priority first</option>
                <option value="low-to-high">Low priority first</option>
            </select>

            {hasCompleted && (
                <button type="button" className="btn btn-ghost" onClick={onClearCompleted}>
                    Clear completed
                </button>
            )}

            <div className="view-toggle" role="group" aria-label="View">
                <button
                    type="button"
                    aria-pressed={viewMode === 'board'}
                    onClick={() => setViewMode('board')}
                >
                    Board
                </button>

                <button
                    type="button"
                    aria-pressed={viewMode === 'list'}
                    onClick={() => setViewMode('list')}
                >
                    List
                </button>
            </div>
        </div>
    );
}

export default TaskFilters;
