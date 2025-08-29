export const users = [
    {
        firstName: 'John',
        lastName: 'Doe',
        profilePic:
            '/images/vecteezy_young-boy-face-illustration-design_9280306.svg',
    },
    {
        firstName: 'Jane',
        lastName: 'Doe',
        profilePic:
            '/images/vecteezy_straight-hair-young-girl-face-illustration-design_9280335.svg',
    },
];

export const sidebarButtons = [
    {
        name: 'Search',
        id: 'searchBtn',
        src: '/icons/magnify.svg',
    },
    {
        name: 'Add task',
        id: 'addTaskBtn',
        src: '/icons/plus-box-outline.svg',
    },
    {
        name: 'Dashboard',
        id: 'dashboardBtn',
        src: '/icons/home-outline.svg',
    },
    {
        name: 'Inbox',
        id: 'inboxBtn',
        src: '/icons/inbox.svg',
    },
    {
        name: 'Today',
        id: 'todayBtn',
        src: '/icons/calendar-check.svg',
    },
];

const projectIcon = '/icons/pound.svg';

export const projectButtons = [
    {
        name: 'General',
        id: 'generalProjectBtn',
        src: projectIcon,
    },
    {
        name: 'Fitness',
        id: 'fitnessProjectBtn',
        src: projectIcon,
    },
    {
        name: 'School',
        id: 'schoolProjectBtn',
        src: projectIcon,
    },
];

export const tasks = [
    {
        id: crypto.randomUUID(),
        title: 'Getting started',
        text: 'Welcome to your todo list! Delete this and start adding your tasks...',
        project: 'General',
        dueDate: '2025-08-08',
        priority: 'p2',
    },
];
