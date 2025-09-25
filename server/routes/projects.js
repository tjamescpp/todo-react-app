import { Router } from 'express';
import projectsController from '../controllers/projectsController.js';

const router = Router();

router.get('/', projectsController.getAllProjects);
router.post('/:userId', projectsController.createProject);
router.delete('/:projectId', projectsController.deleteProject);

export default router;
