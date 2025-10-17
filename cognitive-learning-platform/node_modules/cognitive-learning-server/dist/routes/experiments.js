// --- START OF FILE server/routes/experiments.ts ---
import { Router } from 'express';
import Experiment from '../models/Experiment';
import { authenticateToken, requireTeacher } from '../middleware/auth';
const router = Router();
// --- Get All Experiments ---
// Path: GET /api/experiments
router.get('/', authenticateToken, async (req, res) => {
    try {
        const experiments = await Experiment.find({ isActive: true })
            .populate('createdBy', 'username email')
            .sort({ createdAt: -1 });
        res.json(experiments);
    }
    catch (error) {
        console.error('Error fetching experiments:', error);
        res.status(500).json({ message: 'Server error while fetching experiments.' });
    }
});
// --- Get Single Experiment ---
// Path: GET /api/experiments/:id
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const experiment = await Experiment.findById(id)
            .populate('createdBy', 'username email');
        if (!experiment) {
            return res.status(404).json({ message: 'Experiment not found.' });
        }
        res.json(experiment);
    }
    catch (error) {
        console.error('Error fetching experiment:', error);
        res.status(500).json({ message: 'Server error while fetching experiment.' });
    }
});
// --- Create New Experiment (Teachers Only) ---
// Path: POST /api/experiments
router.post('/', authenticateToken, requireTeacher, async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title || !description) {
            return res.status(400).json({ message: 'Title and description are required.' });
        }
        const newExperiment = new Experiment({
            title,
            description,
            createdBy: req.user.userId,
        });
        await newExperiment.save();
        await newExperiment.populate('createdBy', 'username email');
        res.status(201).json(newExperiment);
    }
    catch (error) {
        console.error('Error creating experiment:', error);
        res.status(500).json({ message: 'Server error while creating experiment.' });
    }
});
// --- Update Experiment (Teachers Only - Own Experiments) ---
// Path: PUT /api/experiments/:id
router.put('/:id', authenticateToken, requireTeacher, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, isActive } = req.body;
        const experiment = await Experiment.findById(id);
        if (!experiment) {
            return res.status(404).json({ message: 'Experiment not found.' });
        }
        // Check if the teacher owns this experiment
        if (experiment.createdBy.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'You can only edit your own experiments.' });
        }
        // Update fields if provided
        if (title)
            experiment.title = title;
        if (description)
            experiment.description = description;
        if (typeof isActive === 'boolean')
            experiment.isActive = isActive;
        await experiment.save();
        await experiment.populate('createdBy', 'username email');
        res.json(experiment);
    }
    catch (error) {
        console.error('Error updating experiment:', error);
        res.status(500).json({ message: 'Server error while updating experiment.' });
    }
});
// --- Delete Experiment (Teachers Only - Own Experiments) ---
// Path: DELETE /api/experiments/:id
router.delete('/:id', authenticateToken, requireTeacher, async (req, res) => {
    try {
        const { id } = req.params;
        const experiment = await Experiment.findById(id);
        if (!experiment) {
            return res.status(404).json({ message: 'Experiment not found.' });
        }
        // Check if the teacher owns this experiment
        if (experiment.createdBy.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'You can only delete your own experiments.' });
        }
        await Experiment.findByIdAndDelete(id);
        res.json({ message: 'Experiment deleted successfully.' });
    }
    catch (error) {
        console.error('Error deleting experiment:', error);
        res.status(500).json({ message: 'Server error while deleting experiment.' });
    }
});
export default router;
// --- END OF FILE server/routes/experiments.ts ---
//# sourceMappingURL=experiments.js.map