import { Question, HistorySession, DashboardStats, User, GenerateRequest } from '../types';
import { questionBank, mockHistorySessions } from '../data/mockQuestions';
import { mockStats } from '../data/mockStats';

const API_BASE = '/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    return await res.json();
  } catch (err) {
    console.warn(`[API Client] Error fetching ${url}, using local fallback:`, err);
    throw err;
  }
}

export const api = {
  // Health
  async checkHealth(): Promise<{ status: string; version: string }> {
    try {
      return await request<{ status: string; version: string }>('/health');
    } catch {
      return { status: 'offline', version: 'local-fallback' };
    }
  },

  // Auth
  async login(email: string, name?: string, role?: string): Promise<{ success: boolean; user: User }> {
    try {
      const data = await request<{ success: boolean; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, name, role }),
      });
      return data;
    } catch {
      const fallbackUser: User = {
        id: `user-${Date.now()}`,
        name: name || email.split('@')[0],
        email,
        avatar: (name || email).charAt(0).toUpperCase(),
        role: role || 'Student',
        streakDays: 8,
        joinedAt: new Date().toISOString(),
      };
      return { success: true, user: fallbackUser };
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      return await request<User>('/auth/me');
    } catch {
      return {
        id: 'user-default',
        name: 'Alex Rivera',
        email: 'alex.rivera@edu.ai',
        avatar: 'A',
        role: 'Senior Learner',
        streakDays: 8,
        joinedAt: new Date().toISOString(),
      };
    }
  },

  // Dashboard Stats
  async getStats(): Promise<DashboardStats> {
    try {
      return await request<DashboardStats>('/stats');
    } catch {
      return mockStats;
    }
  },

  // Topics
  async getTopics(): Promise<{ name: string; count: number }[]> {
    try {
      return await request<{ name: string; count: number }[]>('/topics');
    } catch {
      return [
        { name: 'Python', count: 12 },
        { name: 'React', count: 9 },
        { name: 'GenAI', count: 10 },
        { name: 'Machine Learning', count: 8 },
        { name: 'DSA', count: 15 },
        { name: 'SQL', count: 7 },
        { name: 'Docker', count: 6 },
        { name: 'System Design', count: 5 },
      ];
    }
  },

  // Generation
  async generateQuestions(req: GenerateRequest): Promise<Question[]> {
    try {
      const res = await request<{ success: boolean; questions: Question[] }>('/generate', {
        method: 'POST',
        body: JSON.stringify(req),
      });
      return res.questions;
    } catch {
      // Local fallback generator
      await new Promise((r) => setTimeout(r, 1200));
      const pool = questionBank.filter((q) => q.type === req.type);
      const shuffled = (pool.length > 0 ? pool : questionBank).sort(() => Math.random() - 0.5);
      return shuffled.slice(0, Math.min(req.count, shuffled.length)).map((q, i) => ({
        ...q,
        id: `fallback-${Date.now()}-${i}`,
        isSaved: false,
      }));
    }
  },

  // History
  async getHistory(): Promise<HistorySession[]> {
    try {
      return await request<HistorySession[]>('/history');
    } catch {
      return mockHistorySessions;
    }
  },

  async deleteHistory(id: string): Promise<boolean> {
    try {
      await request(`/history/${id}`, { method: 'DELETE' });
      return true;
    } catch {
      return true;
    }
  },

  // Saved Questions
  async getSaved(): Promise<Question[]> {
    try {
      return await request<Question[]>('/saved');
    } catch {
      const stored = localStorage.getItem('aqg_saved');
      if (stored) {
        try { return JSON.parse(stored); } catch {}
      }
      return [questionBank[0], questionBank[4]];
    }
  },

  async saveQuestion(question: Question): Promise<Question> {
    try {
      const res = await request<{ success: boolean; saved: Question }>('/saved', {
        method: 'POST',
        body: JSON.stringify(question),
      });
      return res.saved || question;
    } catch {
      const savedList = await api.getSaved();
      const updated = [question, ...savedList.filter((q) => q.id !== question.id)];
      localStorage.setItem('aqg_saved', JSON.stringify(updated));
      return question;
    }
  },

  async unsaveQuestion(id: string): Promise<boolean> {
    try {
      await request(`/saved/${id}`, { method: 'DELETE' });
      return true;
    } catch {
      const savedList = await api.getSaved();
      const updated = savedList.filter((q) => q.id !== id);
      localStorage.setItem('aqg_saved', JSON.stringify(updated));
      return true;
    }
  },

  // Quiz
  async finishQuiz(data: { topic: string; score: number; totalQuestions: number; correctCount: number }) {
    try {
      return await request('/quiz/finish', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch {
      return { success: true };
    }
  },
};
