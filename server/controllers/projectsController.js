import prisma from '../prisma.js';
import { dateUtils } from '../utils/dateUtils.js';

async function getAllProjects(req, res) {
    try {
        const projects = await prisma.project.findMany({
            include: {
                tasks: true,
                user: true,
            },
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
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Failed to fetch projects...' });
    }
}

async function createProject(req, res) {
    try {
        const project = await prisma.project.create({
            data: {
                name: req.body.name,
                userId: Number(req.params.userId),
            },
        });

        res.json(project);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Failed to create project...' });
    }
}

async function deleteProject(req, res) {
    try {
        const project = await prisma.project.delete({
            where: { id: Number(req.params.projectId) },
        });

        res.json(project);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Failed to delete project...' });
    }
}

export default {
    getAllProjects,
    createProject,
    deleteProject,
};
