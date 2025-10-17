// --- START OF FILE server/models/User.ts ---
import mongoose, { Schema } from 'mongoose';
const UserSchema = new Schema({
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
export default mongoose.model('User', UserSchema);
// --- END OF FILE server/models/User.ts ---
//# sourceMappingURL=User.js.map