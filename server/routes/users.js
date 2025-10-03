import { Router } from 'express';
import usersController from '../controllers/usersController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/', usersController.getAllUsers);
// protected route to get logged in user
router.get('/me', authenticateToken, usersController.getCurrentUser);
router.get('/:userId', usersController.getUserById);
router.post('/register', usersController.createUser);
// login
router.post('/login', usersController.loginUser);
router.put('/:userId', usersController.updateUser);
router.delete('/:userId', usersController.deleteUser);

export default router;
