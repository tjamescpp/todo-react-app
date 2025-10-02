import { Router } from 'express';
import usersController from '../controllers/usersController.js';
import { passport } from '../utils/auth.js';
import { authMiddleware } from '../utils/auth.js';
const router = Router();

router.get('/', usersController.getAllUsers);
// protected route to get logged in user
router.get('/me', usersController.getCurrentUser);
router.get('/:userId', usersController.getUserById);
router.post('/register', usersController.createUser);
// login route
router.post('/login', passport.authenticate('local'), (req, res) => {
    res.json({ message: 'Logged in', user: req.user });
});
router.put('/:userId', usersController.updateUser);
router.delete('/:userId', usersController.deleteUser);
router.post('/logout', usersController.logoutUser);

export default router;
