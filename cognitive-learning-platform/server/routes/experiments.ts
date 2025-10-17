// --- START OF FILE server/routes/experiments.ts ---
import { Router } from 'express';
import Experiment from '../models/Experiment';
import { requireAuth, requireRole } from '../middleware/auth';
import llmService from '../services/llmService'; // Import LLM service
import ttsService from '../services/ttsService'; // Import TTS service

const router = Router();

// ... (previous routes: POST /, GET /, GET /available, GET /:id) ...

// POST /api/experiments/:id/generate-content - Generate story and audio
router.post('/:id/generate-content', requireAuth, requireRole('teacher'), async (req, res) => {
    try {
        const experiment = await Experiment.findById(req.params.id);
        if (!experiment || experiment.creatorId.toString() !== req.user!.userId) {
            return res.status(404).json({ message: 'Experiment not found or you do not have permission.' });
        }

        const targetWords = experiment.targetWords.map(tw => tw.word);
        if (targetWords.length === 0) {
            return res.status(400).json({ message: 'Experiment must have target words before generating content.' });
        }

        // 1. Generate story text from the LLM service
        const storyText = await llmService.generateStory({
            storyTheme: experiment.storyTheme,
            targetWords,
        });

        // 2. Generate audio from the TTS service
        const audioUrl = await ttsService.generateAudio({
            text: storyText.replace(/__/g, ''), // Remove underscores for clean audio
            filename: `experiment_${experiment._id}_full`,
        });

        // 3. Update the experiment in the database
        experiment.generatedStory = storyText;
        experiment.audioUrl = audioUrl || '';
        await experiment.save();

        res.json({
            message: 'Content generated successfully!',
            experiment,
        });

    } catch (error) {
        console.error("Error generating content:", error);
        res.status(500).json({ message: (error as Error).message || 'Server error while generating content.' });
    }
});


export default router;
// --- END OF FILE server/routes/experiments.ts ---