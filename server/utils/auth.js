import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcryptjs';
import prisma from '../prisma.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'supersecret';

// local strategy for login
passport.use(
    new LocalStrategy(
        { usernameField: 'email' }, // use email instead of deault 'username'
        async (email, password, done) => {
            try {
                const user = await prisma.user.findUnique({ where: { email } });
                if (!user)
                    return done(null, false, { message: 'User not found' });

                const isMatch = bcrypt.compare(password, user.password);
                if (!isMatch)
                    return done(null, false, { message: 'Invalid password' });

                return done(null, user); // success
            } catch (error) {
                return done(error);
            }
        }
    )
);

// serialize user to session
passport.serializeUser((user, done) => {
    done(null, user.id); // only store user.id in session
});

// deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        done(null, user);
    } catch (error) {
        done(error);
    }
});

// JWT strategy for protecting routes
passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: JWT_SECRET,
        },
        async (payload, done) => {
            try {
                const user = await prisma.user.findUnique({
                    where: { id: payload.id },
                });
                if (!user) return done(null, false);
                return done(null, user);
            } catch (error) {
                return done(error, false);
            }
        }
    )
);

// protecting routes
export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token' });

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // should contain { id, email, ... }
        next();
    } catch (error) {
        console.error(error);
        return res.status(403).json({ error: 'Invalid token' });
    }
};

export { passport, JWT_SECRET };
