import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { Question, HistorySession, GenerateRequest } from '../types';
import { mockHistorySessions } from '../data/mockQuestions';
import { api } from '../services/api';

// ─── State ────────────────────────────────────────────────────────────────────

interface QuestionState {
  generatedQuestions: Question[];
  savedQuestions: Question[];
  history: HistorySession[];
  isGenerating: boolean;
  isBackendConnected: boolean;
}

type QuestionAction =
  | { type: 'SET_GENERATING'; payload: boolean }
  | { type: 'SET_GENERATED'; payload: Question[] }
  | { type: 'SET_SAVED'; payload: Question[] }
  | { type: 'SET_HISTORY'; payload: HistorySession[] }
  | { type: 'SET_BACKEND_STATUS'; payload: boolean }
  | { type: 'SAVE_QUESTION'; payload: Question }
  | { type: 'UNSAVE_QUESTION'; payload: string }
  | { type: 'ADD_HISTORY'; payload: HistorySession }
  | { type: 'DELETE_HISTORY'; payload: string }
  | { type: 'CLEAR_GENERATED' };

const initialState: QuestionState = {
  generatedQuestions: [],
  savedQuestions: [],
  history: mockHistorySessions,
  isGenerating: false,
  isBackendConnected: false,
};

function reducer(state: QuestionState, action: QuestionAction): QuestionState {
  switch (action.type) {
    case 'SET_GENERATING':
      return { ...state, isGenerating: action.payload };
    case 'SET_GENERATED':
      return { ...state, generatedQuestions: action.payload, isGenerating: false };
    case 'SET_SAVED':
      return { ...state, savedQuestions: action.payload };
    case 'SET_HISTORY':
      return { ...state, history: action.payload };
    case 'SET_BACKEND_STATUS':
      return { ...state, isBackendConnected: action.payload };
    case 'SAVE_QUESTION': {
      const q = action.payload;
      const alreadySaved = state.savedQuestions.some((s) => s.id === q.id);
      if (alreadySaved) return state;
      return {
        ...state,
        savedQuestions: [{ ...q, isSaved: true }, ...state.savedQuestions],
        generatedQuestions: state.generatedQuestions.map((gq) =>
          gq.id === q.id ? { ...gq, isSaved: true } : gq
        ),
      };
    }
    case 'UNSAVE_QUESTION':
      return {
        ...state,
        savedQuestions: state.savedQuestions.filter((q) => q.id !== action.payload),
        generatedQuestions: state.generatedQuestions.map((gq) =>
          gq.id === action.payload ? { ...gq, isSaved: false } : gq
        ),
      };
    case 'ADD_HISTORY':
      return { ...state, history: [action.payload, ...state.history] };
    case 'DELETE_HISTORY':
      return { ...state, history: state.history.filter((h) => h.id !== action.payload) };
    case 'CLEAR_GENERATED':
      return { ...state, generatedQuestions: [] };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface QuestionContextValue extends QuestionState {
  setGenerating: (v: boolean) => void;
  setGenerated: (questions: Question[]) => void;
  generateWithApi: (req: GenerateRequest) => Promise<Question[]>;
  saveQuestion: (question: Question) => void;
  unsaveQuestion: (id: string) => void;
  addHistory: (session: HistorySession) => void;
  deleteHistory: (id: string) => void;
  clearGenerated: () => void;
  refreshData: () => Promise<void>;
}

const QuestionContext = createContext<QuestionContextValue | null>(null);

export const QuestionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Initial data loading from backend
  const refreshData = useCallback(async () => {
    try {
      const health = await api.checkHealth();
      dispatch({ type: 'SET_BACKEND_STATUS', payload: health.status === 'ok' });

      const [saved, history] = await Promise.all([
        api.getSaved().catch(() => []),
        api.getHistory().catch(() => []),
      ]);

      if (saved && saved.length > 0) {
        dispatch({ type: 'SET_SAVED', payload: saved });
      }
      if (history && history.length > 0) {
        dispatch({ type: 'SET_HISTORY', payload: history });
      }
    } catch (err) {
      console.warn('[QuestionContext] Init load warning:', err);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const setGenerating = useCallback((v: boolean) => dispatch({ type: 'SET_GENERATING', payload: v }), []);
  const setGenerated = useCallback((questions: Question[]) => dispatch({ type: 'SET_GENERATED', payload: questions }), []);

  const generateWithApi = useCallback(async (req: GenerateRequest): Promise<Question[]> => {
    dispatch({ type: 'SET_GENERATING', payload: true });
    try {
      const questions = await api.generateQuestions(req);
      dispatch({ type: 'SET_GENERATED', payload: questions });

      // Refresh history
      const history = await api.getHistory();
      dispatch({ type: 'SET_HISTORY', payload: history });
      return questions;
    } catch (err) {
      console.error('[QuestionContext] Generation error:', err);
      dispatch({ type: 'SET_GENERATING', payload: false });
      return [];
    }
  }, []);

  const saveQuestion = useCallback((question: Question) => {
    // Optimistic UI update
    dispatch({ type: 'SAVE_QUESTION', payload: question });
    api.saveQuestion(question).catch((e) => console.warn('Save API failed:', e));
  }, []);

  const unsaveQuestion = useCallback((id: string) => {
    dispatch({ type: 'UNSAVE_QUESTION', payload: id });
    api.unsaveQuestion(id).catch((e) => console.warn('Unsave API failed:', e));
  }, []);

  const addHistory = useCallback((session: HistorySession) => {
    dispatch({ type: 'ADD_HISTORY', payload: session });
  }, []);

  const deleteHistory = useCallback((id: string) => {
    dispatch({ type: 'DELETE_HISTORY', payload: id });
    api.deleteHistory(id).catch((e) => console.warn('Delete history API failed:', e));
  }, []);

  const clearGenerated = useCallback(() => dispatch({ type: 'CLEAR_GENERATED' }), []);

  return (
    <QuestionContext.Provider
      value={{
        ...state,
        setGenerating,
        setGenerated,
        generateWithApi,
        saveQuestion,
        unsaveQuestion,
        addHistory,
        deleteHistory,
        clearGenerated,
        refreshData,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
};

export const useQuestions = (): QuestionContextValue => {
  const ctx = useContext(QuestionContext);
  if (!ctx) throw new Error('useQuestions must be used inside QuestionProvider');
  return ctx;
};
