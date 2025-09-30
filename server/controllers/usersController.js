import prisma from '../prisma.js';

async function getAllUsers(req, res) {
    const allUsers = await prisma.user.findMany({
        include: {
            tasks: {
                include: {
                    user: true,
                    project: true,
                },
            },
            projects: {
                include: {
                    tasks: true,
                },
            },
        },
    });

    res.json(allUsers);
}

async function getUserById(req, res) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(req.params.userId) },
            include: {
                tasks: true,
                projects: {
                    include: { tasks: true },
                },
            },
        });

        res.json(user);
    } catch (error) {
        console.error('Failed to fetch user by id...');
    }
}

async function createUser(req, res) {
    const { email, firstName, lastName, username, password } = req.body;

    try {
        const result = await prisma.$transaction(async (tx) => {
            // create user
            const user = await tx.user.create({
                data: {
                    email,
                    firstName,
                    lastName,
                    username,
                    password,
                },
            });

            // create defaul project for user
            const project = await tx.project.create({
                data: {
                    name: 'General',
                    userId: user.id,
                },
            });

            // create default task for that project (and set userId explicitly)
            await tx.task.create({
                data: {
                    title: 'Welcome to Tasker!',
                    text: 'Start creating new tasks now...',
                    projectId: project.id,
                    userId: user.id,
                },
            });

            // return the user with relations
            const userWithRelations = await tx.user.findUnique({
                where: { id: user.id },
                include: {
                    projects: {
                        include: { tasks: true },
                    },
                    tasks: true,
                },
            });

            return userWithRelations;
        });

        res.status(201).json(result);
    } catch (error) {
        console.error('createUser error', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
}

async function updateUser(req, res) {
    const user = await prisma.user.update({
        where: { id: Number(req.params.userId) },
        data: { email: req.body.email },
    });

    res.json(user);
}

async function deleteUser(req, res) {
    try {
        const user = await prisma.user.delete({
            where: { id: Number(req.params.userId) },
        });

        res.json(user);
    } catch (error) {
        console.error('Failed deleting user...', error);
    }
}

export default {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};
