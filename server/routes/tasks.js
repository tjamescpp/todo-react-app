import { Router } from 'express';
import tasksController from '../controllers/tasksController.js';

const router = Router();

router.get('/', tasksController.getAllTasks);
router.post('/:userId', tasksController.createTask);
router.put('/:taskId', tasksController.updateTask);
router.delete('/:taskId', tasksController.deleteTask);

export default router;
