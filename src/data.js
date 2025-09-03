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

export const projects = ['All', 'General', 'Fitness', 'School'];
