import { Router } from 'express';
import usersController from '../controllers/usersController.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

// router.get('/', usersController.getAllUsers);
// get logged in user
router.get('/me', authenticateToken, usersController.getCurrentUser);
router.get('/:userId', authenticateToken, usersController.getUserById);
router.post('/register', upload.single('picture'), usersController.createUser);
router.post('/login', usersController.loginUser);
router.put('/:userId', authenticateToken, usersController.updateUser);
router.delete('/:userId', authenticateToken, usersController.deleteUser);

export default router;
