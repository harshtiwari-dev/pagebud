export function getDateString(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function formatDate(dateString) {
    return new Date(`${dateString}T00:00:00`).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short'
    });
}

export function daysOverdue(dueDate) {
    const today = new Date(`${getDateString()}T00:00:00`);
    const due = new Date(`${dueDate}T00:00:00`);

    return Math.round((today - due) / 86400000);
}

export function dueLabel(dueDate) {
    if (!dueDate) return null;

    const today = getDateString();

    if (dueDate === today) return { text: 'Due today', state: 'today' };

    if (dueDate < today) {
        const days = daysOverdue(dueDate);
        return {
            text: `Overdue by ${days} ${days === 1 ? 'day' : 'days'}`,
            state: 'overdue'
        };
    }

    return { text: formatDate(dueDate), state: 'upcoming' };
}
