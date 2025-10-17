// --- START OF FILE server/index.ts ---
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectToDatabase } from './lib/db';
import authRoutes from './routes/auth';
import experimentRoutes from './routes/experiments'; // Ensure this import exists

// --- Initial Setup ---
dotenv.config();
connectToDatabase();

const app = express();
const PORT = process.env.PORT || 4000;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- API Routes ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/experiments', experimentRoutes); // <-- This is the crucial line we were missing.

// --- Static File Serving (for production) ---
if (process.env.NODE_ENV === 'production') {
  // We need to adjust this path for the new build output location
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  // The build output is now at the root 'dist' folder
  const clientBuildPath = path.join(__dirname, '../../dist'); // Go up from server/dist to root, then to dist
  app.use(express.static(clientBuildPath));

  // For any other request, serve the index.html from the client build
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(clientBuildPath, 'index.html'));
  });
}

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
// --- END OF FILE server/index.ts ---