// --- START OF FILE server/models/User.ts ---
import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from '../../shared/types';

// Server-side user interface that includes the password hash
export interface IUserWithPassword extends Omit<IUser, '_id'> {
  passwordHash: string;
}

// Extend Mongoose's Document interface with our IUserWithPassword type
export interface IUserDocument extends IUserWithPassword, Document {}

const UserSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['participant', 'teacher'],
    required: true,
    default: 'participant',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // We'll add more fields like consent, demographics, etc. later
});

export default mongoose.model<IUserDocument>('User', UserSchema);
// --- END OF FILE server/models/User.ts ---