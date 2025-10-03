import { Router } from 'express';
import tasksController from '../controllers/tasksController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// router.get('/', tasksController.getAllTasks);
router.post('/:userId', authenticateToken, tasksController.createTask);
router.put('/:taskId', authenticateToken, tasksController.updateTask);
router.delete('/:taskId', authenticateToken, tasksController.deleteTask);

export default router;
