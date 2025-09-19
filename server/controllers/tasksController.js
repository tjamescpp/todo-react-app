import prisma from '../prisma.js';

async function getAllTasks(req, res) {
    const allTasks = await prisma.task.findMany({
        include: {
            user: true,
            project: true,
        },
    });
    res.json(allTasks);
}
async function createTask(req, res) {
    const task = await prisma.task.create({
        data: {
            title: 'Getting started',
            text: 'Welcome to your tasks list! Start adding new tasks...',
            userId: 1,
        },
    });
    res.json(task);
}

export default {
    getAllTasks,
    createTask,
};
