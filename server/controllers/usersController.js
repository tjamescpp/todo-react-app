import passport from 'passport';
import prisma from '../prisma.js';
import { JWT_SECRET } from '../utils/auth.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to fetch user data' });
    }
}

async function createUser(req, res) {
    try {
        const { email, firstName, lastName, username } = req.body;
        const hashed = await bcrypt.hash(req.body.password, 10);
        const result = await prisma.$transaction(async (tx) => {
            // create user
            const user = await tx.user.create({
                data: {
                    email,
                    firstName,
                    lastName,
                    username,
                    password: hashed,
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
    try {
        const { userId } = req.params;

        // only allowed fields can be updated
        const allowedFields = [
            'firstName',
            'lastName',
            'email',
            'username',
            'password',
        ];
        const data = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                data[field] = req.body[field];
            }
        }

        // hash password if it exists
        if (data.password) {
            const salt = await bcrypt.genSalt(10);
            data.password = await bcrypt.hash(data.password, salt);
        }

        const user = await prisma.user.update({
            where: { id: Number(userId) },
            data, // only updates fields provided in the body
        });

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
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

// login and issue JWT
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user)
            return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id }, JWT_SECRET, {
            expiresIn: '1d',
        });

        res.json({
            token,
            user: { id: user.id, email: user.email, username: user.username },
        });
    } catch (error) {
        console.log('loginUser function...');
        console.error(error);
        res.status(500).json({ error: 'Login failed' });
    }
};

// get current user (protected)
function getProfile(req, res) {
    res.json({ user: req.user });
}

export default {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    loginUser,
    getProfile,
};
