import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined.");
    process.exit(1);
}
/**
 * Middleware to authenticate JWT tokens
 */
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    if (!token) {
        return res.status(401).json({ message: 'Access token required.' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error('Token verification failed:', error);
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
};
/**
 * Middleware to check if user has teacher role
 */
export const requireTeacher = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required.' });
    }
    if (req.user.role !== 'teacher') {
        return res.status(403).json({ message: 'Teacher access required.' });
    }
    next();
};
/**
 * Middleware to check if user has participant role
 */
export const requireParticipant = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required.' });
    }
    if (req.user.role !== 'participant') {
        return res.status(403).json({ message: 'Participant access required.' });
    }
    next();
};
// --- END OF FILE server/middleware/auth.ts ---
//# sourceMappingURL=auth.js.map