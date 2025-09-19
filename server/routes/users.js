import { Router } from 'express';
import userController from '../controllers/usersController.js';
const router = Router();

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.put('/:userId', userController.updateUser);

export default router;
