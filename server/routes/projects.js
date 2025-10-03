import { Router } from 'express';
import projectsController from '../controllers/projectsController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// router.get('/', projectsController.getAllProjects);
router.post('/:userId', authenticateToken, projectsController.createProject);
router.delete(
    '/:projectId',
    authenticateToken,
    projectsController.deleteProject
);

export default router;
