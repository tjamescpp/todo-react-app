import prisma from '../prisma.js';

async function getAllTasks(req, res) {
    const allTasks = await prisma.task.findMany({
        include: {
            user: true,
            project: true,
        },
        cacheStrategy: { ttl: 60 },
    });

    res.json(allTasks);
}

async function createTask(req, res) {
    try {
        // date validation
        const date = new Date(req.body.dueDate);

        // check if the date is valid
        if (isNaN(date.getTime())) {
            return res.status(400).json({ error: 'Invalid date format' });
        }
        // create task
        const task = await prisma.task.create({
            data: {
                title: req.body.title,
                text: req.body.text,
                projectId: Number(req.body.projectId),
                dueDate: date,
                priority: req.body.priority,
                userId: Number(req.params.userId),
            },
            cacheStrategy: { ttl: 60 }, // cache query
        });

        res.json(task);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Failed creating task...' });
    }
}

async function updateTask(req, res) {
    const task = await prisma.task.update({
        where: { id: Number(req.params.taskId) },
        data: {
            projectId: Number(req.body.projectId),
        },
        cacheStrategy: { ttl: 60 },
    });

    res.json(task);
}

export default {
    getAllTasks,
    createTask,
    updateTask,
};
