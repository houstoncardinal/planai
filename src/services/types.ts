export interface AIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  success?: boolean;
  error?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface CodeAnalysisResult {
  analysis: string;
  suggestions: string[];
  issues: string[];
  score: number;
}
