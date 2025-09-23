/**
 * Controller for handling task-related operations.
 * Uses Prisma ORM for database interactions.
 * Includes functions to get all tasks, create, update, and delete tasks.
 * Date formatting and validation handled via dateUtils.
 */

import prisma from '../prisma.js';
import { dateUtils } from '../utils/dateUtils.js';

/**
 * Fetches all tasks from the database, including related user and project data.
 * Formats the dueDate property to 'YYYY-MM-DD' string.
 *
 * @async
 * @function getAllTasks
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {void}
 */
async function getAllTasks(req, res) {
    // fetch all tasks
    const allTasksFormatted = await fetchTasks();
    console.log('Tasks fetched:', allTasksFormatted);
    // return response as json
    res.json(allTasksFormatted);
}

/**
 * Creates a new task in the database after validating the due date.
 *
 * @async
 * @function createTask
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {void}
 */
async function createTask(req, res) {
    try {
        // date validation
        const date = dateUtils.toDateObject(req.body.dueDate);

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
        console.log('Created task:', task);

        // const tasks = await fetchTasks();
        const formattedTask = {
            ...task,
            dueDate: dateUtils.toDateString(task.dueDate),
        };
        res.json(formattedTask);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Failed creating task...' });
    }
}

/**
 * Updates an existing task's projectId in the database.
 *
 * @async
 * @function updateTask
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<Object>} The updated task object.
 * @throws {Error} If the update operation fails.
 *
 * @description
 * Uses Prisma to update the projectId of a task identified by taskId.
 * Applies a cache strategy with a TTL of 60 seconds.
 */
async function updateTask(req, res) {
    try {
        const task = await prisma.task.update({
            // The ID of the task to update
            where: { id: Number(req.params.taskId) },
            // The data to update
            data: {
                projectId: Number(req.body.projectId),
            },
            cacheStrategy: { ttl: 60 }, // Cache query
        });

        res.json(task);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Failed updating task...' });
    }
}

/**
 * Deletes a task from the database by its ID.
 *
 * @async
 * @function deleteTask
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {void}
 */
async function deleteTask(req, res) {
    try {
        const task = await prisma.task.delete({
            // Id of the task to be deleted
            where: { id: Number(req.params.taskId) },
            cacheStrategy: { ttl: 60 }, // Cache query
        });

        res.json(task);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Failed deleting task...' });
    }
}

async function fetchTasks() {
    const allTasks = await prisma.task.findMany({
        // include relationships
        include: {
            user: true,
            project: true,
        },
        // prisma caching for accelerate
        cacheStrategy: { ttl: 60 },
    });

    // formats the returned DateTime object dueDate into a string in YYYY-MM-DD format
    const allTasksFormatted = allTasks.map((task) => ({
        ...task,
        dueDate: dateUtils.toDateString(task.dueDate),
    }));
    return allTasksFormatted;
}

export default {
    getAllTasks,
    createTask,
    updateTask,
    deleteTask,
};
