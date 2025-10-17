// --- START OF FILE shared/types.ts ---
/**
 * Represents the core user object stored in the database.
 * The passwordHash is intentionally omitted for security when sending user data to the client.
 */
export interface IUser {
  _id: string;
  username: string;
  email: string;
  role: 'participant' | 'teacher';
  createdAt: Date;
}

/**
 * Represents the payload of our JSON Web Token (JWT).
 * This is what's stored in the user's browser to keep them logged in.
 */
export interface IJwtPayload {
  userId: string;
  username: string;
  role: 'participant' | 'teacher';
}

/**
 * Represents a single target word with its definition.
 */
export interface ITargetWord {
  word: string;
  definition: string;
}

/**
 * Represents a full experiment object.
 */
export interface IExperiment {
  _id: string;
  title: string;
  description?: string;
  storyTheme: string;
  targetWords: ITargetWord[];
  generatedStory?: string;
  audioUrl?: string;
  isActive: boolean;
  creatorId: string;
  createdAt: Date;
}
// --- END OF FILE shared/types.ts ---