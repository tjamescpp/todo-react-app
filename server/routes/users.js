import { Router } from 'express';
import userController from '../controllers/usersController.js';
import usersController from '../controllers/usersController.js';
const router = Router();

router.get('/', userController.getAllUsers);
router.get('/:userId', usersController.getUserById);
router.post('/', userController.createUser);
router.put('/:userId', userController.updateUser);
router.delete('/:userId', usersController.deleteUser);

export default router;
