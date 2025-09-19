import { Router } from 'express';
import tasksController from '../controllers/tasksController.js';

const router = Router();

router.get('/', tasksController.getAllTasks);
router.post('/', tasksController.createTask);

export default router;
