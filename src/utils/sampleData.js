import { getDateString } from './dates';

function daysFromToday(offset) {
    const date = new Date();
    date.setDate(date.getDate() + offset);

    return getDateString(date);
}

// [title, priority, how many days ago it was finished]
const finishedSamples = [
    ['Set up the React project', 'High', 27],
    ['Read Java collections notes', 'Medium', 26],
    ['Solve two-sum on LeetCode', 'Medium', 24],
    ['Update LinkedIn headline', 'Low', 22],
    ['Finish DBMS assignment', 'High', 21],
    ['Revise SQL joins', 'Medium', 21],
    ['Push portfolio to GitHub', 'High', 19],
    ['Mock interview practice', 'Medium', 17],
    ['Solve binary search problems', 'Medium', 16],
    ['Write project README', 'Medium', 14],
    ['Submit lab record', 'Low', 12],
    ['Learn useState and useEffect', 'High', 10],
    ['Fix navbar bug', 'Medium', 9],
    ['Solve linked list problems', 'Medium', 9],
    ['Resume review with a senior', 'High', 7],
    ['Practice SQL queries', 'Medium', 6],
    ['Revise OOP concepts', 'Medium', 4],
    ['Solve sliding window set', 'High', 3],
    ['Deploy site to Vercel', 'High', 2],
    ['Draft cover letter', 'Medium', 1],
    ['Complete aptitude test', 'Medium', 1],
    ['Review a pull request', 'Low', 0],
    ['Plan next week', 'Low', 0]
];

// [title, priority, status, due date offset in days (null = no due date)]
const openSamples = [
    ['Finish assignment 4', 'High', 'todo', -2],
    ['Renew library books', 'Low', 'todo', -1],
    ['Send resume to placement cell', 'High', 'todo', 0],
    ['Prepare for aptitude round', 'Medium', 'in-progress', 0],
    ['Solve 3 DSA problems', 'Medium', 'todo', 1],
    ['Build the dashboard charts', 'High', 'in-progress', 2],
    ['Practice mock interview questions', 'Medium', 'in-progress', 4],
    ['Read system design basics', 'Low', 'todo', 6],
    ['Update GitHub profile README', 'Low', 'todo', null]
];

export function generateSampleTasks() {
    const finished = finishedSamples.map(([title, priority, daysAgo], index) => ({
        id: 1000 + index,
        title,
        priority,
        status: 'done',
        completed: true,
        dueDate: '',
        createdAt: daysFromToday(-(daysAgo + 2)),
        completedAt: daysFromToday(-daysAgo),
        isSample: true
    }));

    const open = openSamples.map(([title, priority, status, due], index) => ({
        id: 2000 + index,
        title,
        priority,
        status,
        completed: false,
        dueDate: due === null ? '' : daysFromToday(due),
        createdAt: daysFromToday(-3),
        completedAt: null,
        isSample: true
    }));

    return [...open, ...finished];
}