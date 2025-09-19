import prisma from '../prisma.js';

async function getAllUsers(req, res) {
    const allUsers = await prisma.user.findMany({
        include: {
            tasks: true,
            projects: true,
        },
        cacheStrategy: { ttl: 60 },
    });

    res.json(allUsers);
}

async function createUser(req, res) {
    const user = await prisma.user.create({
        data: {
            email: '123@email.com',
            firstName: 'John',
            lastName: 'Doe',
            username: 'john123',
            tasks: {
                create: {
                    title: 'Testing',
                    text: 'Testing database queries',
                },
            },
        },
        cacheStrategy: { ttl: 60 },
    });

    res.json(user);
}

async function updateUser(req, res) {
    const user = await prisma.user.update({
        where: { id: Number(req.params.userId) },
        data: { email: req.body.email },
        cacheStrategy: { ttl: 60 },
    });

    res.json(user);
}

export default {
    createUser,
    getAllUsers,
    updateUser,
};
