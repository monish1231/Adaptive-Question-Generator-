import { Question, GenerateRequest, Difficulty } from '../types';
import { questionBank } from '../data/mockQuestions';

// Simulate AI-like generation by sampling and transforming the question bank
export const generateQuestions = async (req: GenerateRequest): Promise<Question[]> => {
  // Simulate network delay
  await new Promise((res) => setTimeout(res, 2500));

  const { topics, count, difficulty, type } = req;

  // Filter by topic and type
  let pool = questionBank.filter((q) => {
    const topicMatch = topics.length === 0 || topics.some((t) =>
      q.topic.toLowerCase().includes(t.toLowerCase()) ||
      t.toLowerCase().includes(q.topic.toLowerCase())
    );
    const typeMatch = q.type === type;
    return topicMatch && typeMatch;
  });

  // Filter by difficulty (adaptive picks all)
  if (difficulty !== 'adaptive') {
    pool = pool.filter((q) => q.difficulty === difficulty);
  }

  // If pool is too small, fall back to all questions of that type
  if (pool.length === 0) {
    pool = questionBank.filter((q) => q.type === type);
  }
  if (pool.length === 0) {
    pool = [...questionBank];
  }

  // Shuffle and pick
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  // If we need more than available, repeat with variation
  if (selected.length < count) {
    const extra = Array.from({ length: count - selected.length }, (_, i) => ({
      ...shuffled[i % shuffled.length],
      id: `gen-${Date.now()}-${i}`,
      question: `[Variant] ${shuffled[i % shuffled.length].question}`,
    }));
    return [...selected, ...extra].map((q) => ({
      ...q,
      id: `gen-${Date.now()}-${q.id}`,
      difficulty: difficulty === 'adaptive'
        ? (['easy', 'medium', 'hard'] as Exclude<Difficulty, 'adaptive'>[])[Math.floor(Math.random() * 3)]
        : q.difficulty,
      createdAt: new Date().toISOString(),
      isSaved: false,
    }));
  }

  return selected.map((q) => ({
    ...q,
    id: `gen-${Date.now()}-${q.id}`,
    difficulty: difficulty === 'adaptive'
      ? (['easy', 'medium', 'hard'] as Exclude<Difficulty, 'adaptive'>[])[Math.floor(Math.random() * 3)]
      : (difficulty as Exclude<Difficulty, 'adaptive'>),
    createdAt: new Date().toISOString(),
    isSaved: false,
  }));
};

// Adaptive difficulty logic
export const getNextDifficulty = (
  current: Exclude<Difficulty, 'adaptive'>,
  isCorrect: boolean
): Exclude<Difficulty, 'adaptive'> => {
  const levels: Exclude<Difficulty, 'adaptive'>[] = ['easy', 'medium', 'hard'];
  const idx = levels.indexOf(current);
  if (isCorrect) return levels[Math.min(idx + 1, 2)];
  return levels[Math.max(idx - 1, 0)];
};

// Format time
export const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

// Grade label from score
export const getGrade = (score: number): { label: string; color: string } => {
  if (score >= 90) return { label: 'Excellent! 🏆', color: '#10B981' };
  if (score >= 75) return { label: 'Great Work! ⭐', color: '#6366F1' };
  if (score >= 60) return { label: 'Good Job! 👍', color: '#F59E0B' };
  if (score >= 40) return { label: 'Keep Practicing 💪', color: '#F97316' };
  return { label: 'Needs Improvement 📚', color: '#F43F5E' };
};

export const timeAgo = (isoDate: string): string => {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};
