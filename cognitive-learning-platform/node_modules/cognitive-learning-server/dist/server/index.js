// --- START OF FILE server/index.ts ---
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectToDatabase } from './lib/db';
import authRoutes from './routes/auth';
import experimentsRoutes from './routes/experiments';
// --- Initial Setup: Get __dirname in ES Modules ---
// This is the standard way to get the directory name in an ES module.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load environment variables from .env file located in the server directory
dotenv.config({ path: path.resolve(__dirname, './.env') });
// Connect to the database as soon as the server starts
connectToDatabase();
const app = express();
const PORT = process.env.PORT || 4000;
// --- Middleware ---
app.use(cors());
app.use(express.json());
// --- API Routes ---
app.get('/api/health', (_, res) => {
    res.json({ status: 'ok', message: 'Backend is running!' });
});
app.use('/api/auth', authRoutes);
app.use('/api/experiments', experimentsRoutes);
// --- Static File Serving (for production) ---
if (process.env.NODE_ENV === 'production') {
    // Serve the built client files from the 'dist/client' directory
    const clientBuildPath = path.join(__dirname, '../../dist/client');
    app.use(express.static(clientBuildPath));
    // For any other request, fall back to the client's index.html
    app.get('*', (_, res) => {
        res.sendFile(path.resolve(clientBuildPath, 'index.html'));
    });
}
// --- Start Server ---
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
// --- END OF FILE server/index.ts ---
//# sourceMappingURL=index.js.map