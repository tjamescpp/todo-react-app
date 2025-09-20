import prisma from '../prisma.js';
import { dateUtils } from '../utils/dateUtils.js';

async function getAllProjects(req, res) {
    const projects = await prisma.project.findMany({
        include: {
            tasks: true,
            user: true,
        },
        cacheStrategy: { ttl: 60 },
    });

    // format tasks due dates
    const projectsFormattedTasks = projects.map((project) => ({
        ...project,
        tasks: project.tasks.map((tasks) => ({
            ...tasks,
            dueDate: dateUtils.toDateString(tasks.dueDate),
        })),
    }));

    res.json(projectsFormattedTasks);
}

async function createProject(req, res) {
    const project = await prisma.project.create({
        data: {
            name: req.body.name,
            userId: Number(req.params.userId),
        },
        cacheStrategy: { ttl: 60 },
    });

    res.json(project);
}

export default {
    getAllProjects,
    createProject,
};
