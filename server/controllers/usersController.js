import prisma from '../prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cloudinary from '../utils/cloudinary.js';
import streamifier from 'streamifier';

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

async function getCurrentUser(req, res) {
    if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const currentUser = await prisma.user.findUnique({
            where: { id: req.user.id },
            include: {
                tasks: true,
                projects: {
                    include: {
                        tasks: true,
                    },
                },
            },
        });

        res.json(currentUser);
    } catch (error) {
        console.error('Failed to fetch user data:', error);
        res.status(500).json({ error: 'Failed to fetch user data' });
    }
}

async function createUser(req, res) {
    try {
        const { email, firstName, lastName, username, password } = req.body;
        const hashed = await bcrypt.hash(password, 10);
        const file = req.file;
        let pictureUrl;

        if (file) {
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'profile_pics' },
                    (err, result) => {
                        if (err) return reject(err);
                        resolve(result);
                    }
                );
                streamifier.createReadStream(file.buffer).pipe(uploadStream);
            });
            pictureUrl = result.secure_url;
        }

        const result = await prisma.$transaction(async (tx) => {
            // create user
            const user = await tx.user.create({
                data: {
                    email,
                    firstName,
                    lastName,
                    username,
                    picture: pictureUrl,
                    password: hashed,
                },
            });

            // create default project for user
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
            'picture',
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
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // sign JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET, // put this in your .env
            { expiresIn: '1h' }
        );

        res.json({ token, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
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
    getCurrentUser,
};
