import prisma from '../prisma.js';

async function getAllUsers(req, res) {
    const allUsers = await prisma.user.findMany({
        include: {
            tasks: true,
        },
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
    });
    res.json(user);
}

export default {
    createUser,
    getAllUsers,
};
