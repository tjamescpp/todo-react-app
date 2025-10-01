import { Router } from 'express';
import usersController from '../controllers/usersController.js';
import { passport } from '../utils/auth.js';
import { authMiddleware } from '../utils/auth.js';
const router = Router();

router.get('/', usersController.getAllUsers);
router.get('/:userId', usersController.getUserById);
router.get(
    '/me',
    passport.authenticate('jwt', { session: false }),
    usersController.getProfile
);
router.post('/register', usersController.createUser);
// login route
router.post('/login', passport.authenticate('local'), (req, res) => {
    res.json({ message: 'Logged in', user: req.user });
});
// protected route to get logged in user
router.get('/me', (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    res.json(req.user);
});
router.put('/:userId', usersController.updateUser);
router.delete('/:userId', usersController.deleteUser);

export default router;
