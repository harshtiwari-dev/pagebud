import {
    Area,
    AreaChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import { Flame } from 'lucide-react';
import { getDateString, dueLabel } from '../utils/dates';
import './DashboardStats.css';

const statusColumns = [
    { id: 'todo', name: 'To do', color: 'var(--text-tertiary)' },
    { id: 'in-progress', name: 'In progress', color: 'var(--accent)' },
    { id: 'done', name: 'Done', color: 'var(--success)' }
];

function DashboardStats({
    tasks,
    totalTasks,
    completedTasks,
    remainingTasks,
    onOpenTasks
}) {
    const today = new Date();
    const todayString = getDateString(today);

    const completedDates = new Set(
        tasks
            .filter((task) => task.completed && task.completedAt)
            .map((task) => task.completedAt)
    );

    let streak = 0;
    const streakDate = new Date(today);

    if (!completedDates.has(todayString)) {
        streakDate.setDate(streakDate.getDate() - 1);
    }

    while (completedDates.has(getDateString(streakDate))) {
        streak++;
        streakDate.setDate(streakDate.getDate() - 1);
    }

    const completionRate = totalTasks
        ? Math.round((completedTasks / totalTasks) * 100)
        : 0;

    const firstDate = new Date(today);
    firstDate.setDate(today.getDate() - 29);
    const firstDateString = getDateString(firstDate);

    let runningTotal = tasks.filter(
        (task) => task.completed && task.completedAt && task.completedAt < firstDateString
    ).length;

    const monthData = [];
    let finishedInMonth = 0;

    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);

        const dateString = getDateString(date);
        const count = tasks.filter((task) => task.completedAt === dateString).length;

        runningTotal += count;
        finishedInMonth += count;

        monthData.push({
            date: dateString,
            label: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
            count,
            total: runningTotal
        });
    }

    const statusData = statusColumns.map((column) => ({
        ...column,
        value: tasks.filter((task) => (task.status || 'todo') === column.id).length
    }));

    const visibleStatus = statusData.filter((item) => item.value > 0);

    const urgentTasks = tasks
        .filter((task) => !task.completed && task.dueDate && task.dueDate <= todayString)
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

    const shownUrgent = urgentTasks.slice(0, 3);
    const hiddenUrgent = urgentTasks.length - shownUrgent.length;

    return (
        <div className="dashboard-grid">
            <section className="panel metric-row">
                <div className="metric">
                    <p className="metric-label">Total</p>
                    <p className="metric-number">{totalTasks}</p>
                </div>

                <div className="metric">
                    <p className="metric-label">Completed</p>
                    <p className="metric-number">{completedTasks}</p>
                </div>

                <div className="metric">
                    <p className="metric-label">Pending</p>
                    <p className="metric-number">{remainingTasks}</p>
                </div>

                <div className="metric">
                    <p className="metric-label">Completion rate</p>
                    <p className="metric-number">{completionRate}%</p>

                    <div
                        className="progress-track"
                        role="progressbar"
                        aria-label="Task completion rate"
                        aria-valuenow={completionRate}
                        aria-valuemin={0}
                        aria-valuemax={100}
                    >
                        <div className="progress-fill" style={{ width: `${completionRate}%` }} />
                    </div>
                </div>

                <div className="metric">
                    <p className="metric-label">
                        Streak
                        <Flame size={14} strokeWidth={1.8} className="panel-icon" aria-hidden="true" />
                    </p>
                    <p className="metric-number">
                        {streak}
                        <span className="metric-unit">{streak === 1 ? 'day' : 'days'}</span>
                    </p>
                </div>
            </section>

            <div className="dashboard-row">
                <section className="panel chart-panel">
                    <h2 className="panel-title">Tasks completed over time</h2>
                    <p className="panel-note">
                        {finishedInMonth} finished in the last 30 days.
                    </p>

                    <div className="area-chart">
                        <div className="area-chart-inner">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={monthData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                                    <CartesianGrid vertical={false} stroke="var(--chart-gridline)" />

                                    <XAxis
                                        dataKey="label"
                                        interval={4}
                                        tickMargin={8}
                                        tickLine={false}
                                        axisLine={{ stroke: 'var(--border-strong)' }}
                                        tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                                    />

                                    <YAxis
                                        allowDecimals={false}
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                                    />

                                    <Tooltip
                                        cursor={{ stroke: 'var(--border-strong)' }}
                                        contentStyle={{
                                            background: 'var(--surface-raised)',
                                            border: '1px solid var(--border-strong)',
                                            borderRadius: 6,
                                            fontSize: 13,
                                            color: 'var(--ink)'
                                        }}
                                        labelStyle={{ color: 'var(--text-secondary)' }}
                                        itemStyle={{ color: 'var(--ink)' }}
                                        formatter={(value) => [value, 'Done so far']}
                                    />

                                    <Area
                                        type="monotone"
                                        dataKey="total"
                                        stroke="var(--accent)"
                                        strokeWidth={2}
                                        fill="var(--accent)"
                                        fillOpacity={0.12}
                                        activeDot={{ r: 4, fill: 'var(--accent)', stroke: 'var(--surface)' }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </section>

                <section className="panel status-panel">
                    <h2 className="panel-title">Tasks by status</h2>

                    <div className="status-body">
                        <div className="donut">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={visibleStatus}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius={48}
                                        outerRadius={70}
                                        paddingAngle={2}
                                        stroke="var(--surface)"
                                        strokeWidth={2}
                                        isAnimationActive={false}
                                    >
                                        {visibleStatus.map((item) => (
                                            <Cell key={item.id} fill={item.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>

                            <div className="donut-center">
                                <span>{totalTasks}</span>
                                <small>tasks</small>
                            </div>
                        </div>

                        <ul className="status-legend">
                            {statusData.map((item) => (
                                <li key={item.id}>
                                    <span className="legend-dot" style={{ backgroundColor: item.color }} />
                                    <span className="legend-name">{item.name}</span>
                                    <span className="legend-value">{item.value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                <section className="panel due-panel">
                    <h2 className="panel-title">Due today and overdue</h2>

                    {shownUrgent.length === 0 ? (
                        <p className="panel-note urgent-empty">
                            Nothing is due. Add a due date to a task and it shows up here.
                        </p>
                    ) : (
                        <ul className="urgent-list">
                            {shownUrgent.map((task) => {
                                const due = dueLabel(task.dueDate);

                                return (
                                    <li key={task.id} className="urgent-item">
                                        <span className="urgent-title">{task.title}</span>
                                        <span className={`urgent-due is-${due.state}`}>{due.text}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    )}

                    <button type="button" className="link-btn urgent-button" onClick={onOpenTasks}>
                        {hiddenUrgent > 0 ? `${hiddenUrgent} more. Open my tasks` : 'Open my tasks'}
                    </button>
                </section>
            </div>
        </div>
    );
}

export default DashboardStats;