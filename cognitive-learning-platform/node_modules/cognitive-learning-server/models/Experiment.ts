// --- START OF FILE server/models/Experiment.ts ---
import mongoose, { Document, Schema } from 'mongoose';
import { IExperiment } from '../../shared/types';

// Server-side experiment interface that excludes _id to avoid conflict with Mongoose Document
export interface IExperimentData extends Omit<IExperiment, '_id'> {}

export interface IExperimentDocument extends IExperimentData, Document {}

const TargetWordSchema = new Schema({
  word: { type: String, required: true },
  definition: { type: String, required: true },
}, { _id: false });

const ExperimentSchema: Schema = new Schema({
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

export default mongoose.model<IExperimentDocument>('Experiment', ExperimentSchema);
// --- END OF FILE server/models/Experiment.ts ---