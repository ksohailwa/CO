// --- START OF FILE server/routes/auth.ts ---
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
const router = Router();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined.");
    process.exit(1);
}
// --- Registration Endpoint ---
// Path: POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        // Basic validation
        if (!username || !email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        if (role !== 'teacher' && role !== 'participant') {
            return res.status(400).json({ message: 'Invalid role specified.' });
        }
        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(409).json({ message: 'Username or email already exists.' });
        }
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        // Create and save the new user
        const newUser = new User({
            username,
            email,
            passwordHash,
            role,
        });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully.' });
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
});
// --- Login Endpoint ---
// Path: POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        // Basic validation
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }
        // Find the user by username or email
        const user = await User.findOne({ $or: [{ email: username }, { username: username }] });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        // Create JWT payload
        // Ensure the DB values are coerced/validated to match IJwtPayload
        if (!user.role || (user.role !== 'participant' && user.role !== 'teacher')) {
            console.error("Login error: invalid or missing user role for JWT payload:", user.role);
            return res.status(500).json({ message: 'Server error during login.' });
        }
        const payload = {
            userId: String(user._id),
            username: String(user.username),
            role: user.role,
        };
        // Sign the token
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: 'Server error during login.' });
    }
});
export default router;
// --- END OF FILE server/routes/auth.ts ---
//# sourceMappingURL=auth.js.map