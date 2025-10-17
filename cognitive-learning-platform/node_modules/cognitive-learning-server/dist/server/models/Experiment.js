// --- START OF FILE server/models/Experiment.ts ---
import mongoose, { Schema } from 'mongoose';
const TargetWordSchema = new Schema({
    word: { type: String, required: true },
    definition: { type: String, required: true },
}, { _id: false });
const ExperimentSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    storyTheme: {
        type: String,
        required: true,
    },
    targetWords: [TargetWordSchema],
    generatedStory: {
        type: String,
        default: '',
    },
    audioUrl: {
        type: String,
        default: '',
    },
    isActive: {
        type: Boolean,
        default: false,
    },
    creatorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
export default mongoose.model('Experiment', ExperimentSchema);
// --- END OF FILE server/models/Experiment.ts ---
//# sourceMappingURL=Experiment.js.map