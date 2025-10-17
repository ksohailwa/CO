// --- START OF FILE server/routes/experiments.ts ---
import { Router } from 'express';
import Experiment from '../models/Experiment';
import { requireAuth, requireRole } from '../middleware/auth';
const router = Router();
// --- Teacher Routes (Protected) ---
// POST /api/experiments - Create a new experiment
router.post('/', requireAuth, requireRole('teacher'), async (req, res) => {
    try {
        const { title, description, storyTheme, targetWords } = req.body;
        const creatorId = req.user.userId;
        const newExperiment = new Experiment({
            title,
            description,
            storyTheme,
            targetWords,
            creatorId,
        });
        await newExperiment.save();
        res.status(201).json(newExperiment);
    }
    catch (error) {
        console.error("Error creating experiment:", error);
        res.status(500).json({ message: 'Server error while creating experiment.' });
    }
});
// GET /api/experiments - Get all experiments for the logged-in teacher
router.get('/', requireAuth, requireRole('teacher'), async (req, res) => {
    try {
        const experiments = await Experiment.find({ creatorId: req.user.userId }).sort({ createdAt: -1 });
        res.json(experiments);
    }
    catch (error) {
        console.error("Error fetching experiments:", error);
        res.status(500).json({ message: 'Server error while fetching experiments.' });
    }
});
// --- Participant Routes (Protected) ---
// GET /api/experiments/available - Get all active experiments for participants
router.get('/available', requireAuth, requireRole('participant'), async (_, res) => {
    try {
        const experiments = await Experiment.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(experiments);
    }
    catch (error) {
        console.error("Error fetching available experiments:", error);
        res.status(500).json({ message: 'Server error.' });
    }
});
// GET /api/experiments/:id - Get a single experiment's public data
router.get('/:id', requireAuth, async (req, res) => {
    try {
        const experiment = await Experiment.findById(req.params.id);
        if (!experiment) {
            return res.status(404).json({ message: 'Experiment not found.' });
        }
        // Only return non-sensitive data
        res.json({
            id: experiment._id,
            title: experiment.title,
            description: experiment.description,
            generatedStory: experiment.generatedStory,
            targetWords: experiment.targetWords.map((tw) => ({ word: tw.word, definition: tw.definition })), // Ensure only public fields
            audioUrl: experiment.audioUrl,
        });
    }
    catch (error) {
        console.error("Error fetching experiment:", error);
        res.status(500).json({ message: 'Server error.' });
    }
});
export default router;
// --- END OF FILE server/routes/experiments.ts ---
//# sourceMappingURL=experiments.js.map