import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;
export const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization token is required.' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};
// Middleware to check for a specific role
export const requireRole = (role) => {
    return (req, res, next) => {
        if (req.user?.role !== role) {
            return res.status(403).json({ message: 'Forbidden: Insufficient permissions.' });
        }
        next();
    };
};
// --- END OF FILE server/middleware/auth.ts ---
//# sourceMappingURL=auth.js.map