// --- START OF FILE server/services/llmService.ts ---
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- Interfaces for a unified structure ---
interface StoryGenerationParams {
  storyTheme: string;
  targetWords: string[];
  language?: string;
}

interface LlmProvider {
  generateStory(params: StoryGenerationParams): Promise<string>;
}

// --- Google Gemini Adapter ---
class GeminiProvider implements LlmProvider {
  private genAI: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateStory({ storyTheme, targetWords, language = 'en' }: StoryGenerationParams): Promise<string> {
    const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Create a short, engaging story in ${language} of about 150-200 words.
      The story should have a theme of: "${storyTheme}".
      You MUST naturally incorporate the following words into the story, exactly as they are written: ${targetWords.join(", ")}.
      For each of these target words, wrap them in double underscores like so: __word__.
      Example: "He showed great __perseverance__ on his journey."
      Do not add any other formatting. Just provide the story text.
    `;

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      // Simple validation to ensure it looks like a story
      if (text && text.length > 50 && targetWords.every(word => text.includes(`__${word}__`))) {
        return text;
      }
      throw new Error("Generated content did not meet requirements.");
    } catch (error) {
      console.error("Gemini story generation failed:", error);
      throw new Error("Failed to generate story with Gemini.");
    }
  }
}

// --- Fallback Mock Provider ---
class MockProvider implements LlmProvider {
  async generateStory({ storyTheme, targetWords }: StoryGenerationParams): Promise<string> {
    console.warn("Using mock LLM provider. No real AI calls are being made.");
    let story = `This is a mock story about ${storyTheme}. It is important for a student's __${targetWords[0] || 'learning'}__ to understand __${targetWords[1] || 'cognitive'}__ processes. Good __${targetWords[2] || 'research'}__ requires effort. The __${targetWords[3] || 'memory'}__ of the event was clear. This demonstrates the __${targetWords[4] || 'generation'}__ effect.`;
    
    // Ensure all words are included for backend logic to work
    targetWords.forEach(word => {
        if (!story.includes(`__${word}__`)) {
            story += ` The word __${word}__ was also included.`;
        }
    });

    return Promise.resolve(story);
  }
}


// --- Service Factory ---
let llmProvider: LlmProvider;

const geminiApiKey = process.env.GEMINI_API_KEY;

if (geminiApiKey) {
  console.log("✅ Initializing Google Gemini LLM provider.");
  llmProvider = new GeminiProvider(geminiApiKey);
} else {
  // Add other providers here with `else if (process.env.OPENAI_API_KEY)` etc.
  console.warn("⚠️ No LLM API key found. Falling back to mock story generator.");
  llmProvider = new MockProvider();
}

export default llmProvider;
// --- END OF FILE server/services/llmService.ts ---