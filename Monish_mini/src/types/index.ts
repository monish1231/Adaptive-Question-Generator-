// ─── Core Types ───────────────────────────────────────────────────────────────

export type Difficulty = 'easy' | 'medium' | 'hard' | 'adaptive';
export type QuestionType = 'mcq' | 'truefalse' | 'fillinblank';
export type CognitiveDepth = 'concept' | 'code' | 'debug' | 'scenario';

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  topic: string;
  difficulty: Exclude<Difficulty, 'adaptive'>;
  type: QuestionType;
  question: string;
  options?: Option[];
  correctAnswer: string;
  explanation: string;
  codeSnippet?: string;
  tags?: string[];
  isSaved?: boolean;
  savedAt?: string;
  customNotes?: string;
  cognitiveDepth?: CognitiveDepth;
  createdAt: string;
}

// ─── Generation Request ────────────────────────────────────────────────────────

export interface GenerateRequest {
  topics: string[];
  count: number;
  difficulty: Difficulty;
  type: QuestionType;
  cognitiveDepth?: CognitiveDepth;
}

// ─── History ──────────────────────────────────────────────────────────────────

export interface HistorySession {
  id: string;
  topics: string[];
  count: number;
  difficulty: Difficulty;
  type: QuestionType;
  questions: Question[];
  generatedAt: string;
}

// ─── Quiz ─────────────────────────────────────────────────────────────────────

export interface QuizAnswer {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  timeTaken: number; // seconds
  difficulty: Exclude<Difficulty, 'adaptive'>;
}

export interface QuizSession {
  id: string;
  topic: string;
  questions: Question[];
  answers: QuizAnswer[];
  score: number;
  totalTime: number;
  completedAt: string;
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalGenerated: number;
  totalSessions: number;
  averageScore: number;
  streakDays: number;
  savedCount?: number;
  weeklyActivity: { day: string; questions: number; sessions: number }[];
  difficultyDistribution: { name: string; value: number; color: string }[];
  topicDistribution: { topic: string; count: number }[];
  recentActivity: RecentActivity[];
}

export interface RecentActivity {
  id: string;
  type: 'generate' | 'quiz' | 'save';
  description: string;
  time: string;
  icon: string;
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  streakDays?: number;
  joinedAt: string;
}
