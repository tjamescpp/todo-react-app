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
    {
        id: crypto.randomUUID(),
        title: 'Go to the gym',
        text: 'Testing projects...',
        project: 'Fitness',
        dueDate: '2025-08-14',
        priority: 'p3',
    },
    {
        id: crypto.randomUUID(),
        title: 'Work on coding project',
        text: 'Testing projects...',
        project: 'School',
        dueDate: '2025-08-18',
        priority: 'p2',
    },
];

export const projects = [
    {
        title: 'All',
        tasks: [],
    },
    {
        title: 'General',
        tasks: [],
    },
    {
        title: 'Fitness',
        tasks: [],
    },
    {
        title: 'School',
        tasks: [],
    },
];
