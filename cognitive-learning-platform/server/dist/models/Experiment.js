// --- START OF FILE server/models/Experiment.ts ---
import mongoose, { Schema } from 'mongoose';
const ExperimentSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt
});
export default mongoose.model('Experiment', ExperimentSchema);
// --- END OF FILE server/models/Experiment.ts ---
//# sourceMappingURL=Experiment.js.map