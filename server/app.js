import express from 'express';
import { PrismaClient } from './generated/prisma/index.js';
import routes from './routes/index.js';
// import usersRouter from './routes/users.js';
import prisma from './prisma.js';
import cors from 'cors';

const app = express();

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cors
app.use(
    cors({
        origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
        credentials: true,
    })
);

// routes
app.get('/', (req, res) => res.send('Hello, world!'));
app.use('/users', routes.usersRouter);
app.use('/tasks', routes.tasksRouter);
app.use('/projects', routes.projectsRouter);

// close prisma client database connection
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

// listen to the port
const PORT = process.env.PORT || 8000;
app.listen(PORT, (error) => {
    // This is important!
    // Without this, any startup errors will silently fail
    // instead of giving you a helpful error message.
    if (error) {
        throw error;
    }
    console.log(
        `My TODO Express app - listening on port http://localhost:${PORT}`
    );
});
