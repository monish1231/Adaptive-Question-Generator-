import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Card, CardContent, Typography, Button, LinearProgress,
  Chip, Grid, alpha, Divider, CircularProgress, Tooltip,
} from '@mui/material';
import {
  Psychology as QuizIcon, CheckCircle, Cancel,
  EmojiEvents, Replay, ArrowForward, BookmarkAdd,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Question, Difficulty, QuizAnswer } from '../types';
import { questionBank, TOPICS } from '../data/mockQuestions';
import { getNextDifficulty, getGrade } from '../utils/questionGenerator';
import { useQuestions } from '../context/QuestionContext';
import { api } from '../services/api';

type QuizPhase = 'setup' | 'quiz' | 'result';

const QUIZ_COUNT = 8;
const TIME_PER_QUESTION = 30;

const difficultyColors: Record<string, string> = {
  easy: '#10B981',
  medium: '#F59E0B',
  hard: '#F43F5E',
};

const AdaptiveQuizPage: React.FC = () => {
  const { saveQuestion } = useQuestions();

  const [phase, setPhase] = useState<QuizPhase>('setup');
  const [selectedTopic, setSelectedTopic] = useState('Python');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [currentDifficulty, setCurrentDifficulty] = useState<Exclude<Difficulty, 'adaptive'>>('medium');
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [savedMissed, setSavedMissed] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (phase !== 'quiz' || isAnswered) return;
    if (timeLeft === 0) {
      handleAnswer(null);
      return;
    }
    const t = setTimeout(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, phase, isAnswered]);

  const buildQuestions = useCallback(() => {
    const pool = questionBank.filter(
      (q) => q.topic.toLowerCase().includes(selectedTopic.toLowerCase()) && q.type === 'mcq'
    );
    const fallback = questionBank.filter((q) => q.type === 'mcq');
    const base = pool.length >= 3 ? pool : fallback;
    const shuffled = [...base].sort(() => Math.random() - 0.5);

    const easy = shuffled.filter((q) => q.difficulty === 'easy');
    const medium = shuffled.filter((q) => q.difficulty === 'medium');
    const hard = shuffled.filter((q) => q.difficulty === 'hard');
    const mixed = [...easy.slice(0, 3), ...medium.slice(0, 3), ...hard.slice(0, 3)];

    const list = mixed.length >= QUIZ_COUNT ? mixed.slice(0, QUIZ_COUNT) : shuffled.slice(0, QUIZ_COUNT);
    return list;
  }, [selectedTopic]);

  const startQuiz = () => {
    const qs = buildQuestions();
    setQuestions(qs);
    setCurrentIdx(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setCurrentDifficulty('medium');
    setTimeLeft(TIME_PER_QUESTION);
    setFeedback(null);
    setSavedMissed(false);
    setPhase('quiz');
  };

  const handleAnswer = (optId: string | null) => {
    if (isAnswered) return;
    const q = questions[currentIdx];
    const isCorrect = optId !== null && optId === q.correctAnswer;

    setSelectedAnswer(optId);
    setIsAnswered(true);
    setFeedback(isCorrect ? 'correct' : 'wrong');

    const ans: QuizAnswer = {
      questionId: q.id,
      selectedAnswer: optId || '',
      isCorrect,
      timeTaken: TIME_PER_QUESTION - timeLeft,
      difficulty: q.difficulty,
    };
    setAnswers((prev) => [...prev, ans]);
    setCurrentDifficulty(getNextDifficulty(currentDifficulty, isCorrect));
  };

  const handleNext = async () => {
    if (currentIdx + 1 >= questions.length) {
      const finalScore = Math.round(
        (answers.filter((a) => a.isCorrect).length / answers.length) * 100
      );
      // Persist to backend API
      await api.finishQuiz({
        topic: selectedTopic,
        score: finalScore,
        totalQuestions: questions.length,
        correctCount: answers.filter((a) => a.isCorrect).length,
      });
      setPhase('result');
    } else {
      setCurrentIdx((i) => i + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setFeedback(null);
      setTimeLeft(TIME_PER_QUESTION);
    }
  };

  const handleSaveMissedQuestions = () => {
    const wrongAnswers = answers.filter((a) => !a.isCorrect);
    wrongAnswers.forEach((ans) => {
      const q = questions.find((item) => item.id === ans.questionId);
      if (q) saveQuestion(q);
    });
    setSavedMissed(true);
  };

  const score =
    answers.length > 0
      ? Math.round((answers.filter((a) => a.isCorrect).length / answers.length) * 100)
      : 0;

  const currentQ = questions[currentIdx];

  // ─── Setup Screen ─────────────────────────────────────────────────────────
  if (phase === 'setup') {
    return (
      <Box sx={{ maxWidth: { xs: '100%', md: 840, lg: 900 }, mx: 'auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent sx={{ p: { xs: 3, sm: 4.5 } }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Box
                  sx={{
                    width: 76,
                    height: 76,
                    borderRadius: '22px',
                    background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    boxShadow: '0 8px 30px rgba(99,102,241,0.35)',
                  }}
                >
                  <QuizIcon sx={{ color: '#fff', fontSize: 40 }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                  Adaptive Quiz Arena
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 460, mx: 'auto' }}>
                  Real-time cognitive difficulty adaptation. Correct answers unlock harder questions, while misses recalibrate to reinforce core concepts.
                </Typography>
              </Box>

              {/* Adaptive Mechanism Explanation Cards */}
              <Box
                sx={{
                  mb: 4,
                  p: 3,
                  borderRadius: '16px',
                  bgcolor: (t) => alpha(t.palette.primary.main, 0.05),
                  border: (t) => `1px solid ${alpha(t.palette.primary.main, 0.15)}`,
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, color: 'primary.main' }}>
                  ⚡ ADAPTIVE LOGIC SPECIFICATION
                </Typography>
                <Grid container spacing={2}>
                  {[
                    { icon: '🚀', title: 'Level Up', desc: 'Correct response increases difficulty to test deeper mastery' },
                    { icon: '🛡️', title: 'Recalibrate', desc: 'Incorrect answer shifts difficulty to consolidate fundamentals' },
                    { icon: '⏱️', title: 'Speed Tracker', desc: `${TIME_PER_QUESTION}s dynamic countdown with timed bonuses` },
                    { icon: '📊', title: 'Skill Diagnostics', desc: 'Full diagnostic performance breakdown upon completion' },
                  ].map((item) => (
                    <Grid item xs={12} sm={6} key={item.title}>
                      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                        <Typography sx={{ fontSize: '1.4rem' }}>{item.icon}</Typography>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, textTransform: 'none' }}>
                            {item.title}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                            {item.desc}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Topic Select */}
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: 'text.secondary' }}>
                SELECT EVALUATION DOMAIN
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
                {TOPICS.slice(0, 10).map((t) => (
                  <Chip
                    key={t}
                    label={t}
                    onClick={() => setSelectedTopic(t)}
                    sx={{
                      cursor: 'pointer',
                      fontWeight: 700,
                      px: 0.5,
                      py: 2,
                      borderRadius: '10px',
                      bgcolor:
                        selectedTopic === t
                          ? (th) => alpha(th.palette.primary.main, 0.2)
                          : 'transparent',
                      color: selectedTopic === t ? 'primary.main' : 'text.secondary',
                      border: '1.5px solid',
                      borderColor: selectedTopic === t ? 'primary.main' : 'divider',
                      '&:hover': {
                        borderColor: 'primary.main',
                      },
                    }}
                  />
                ))}
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={startQuiz}
                endIcon={<ArrowForward />}
                sx={{
                  py: 1.8,
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  letterSpacing: '0.02em',
                  boxShadow: '0 6px 28px rgba(99,102,241,0.4)',
                }}
              >
                Launch Adaptive Quiz — {selectedTopic}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    );
  }

  // ─── Active Quiz Screen ───────────────────────────────────────────────────
  if (phase === 'quiz' && currentQ) {
    const progress = (currentIdx / questions.length) * 100;
    const timerPercent = (timeLeft / TIME_PER_QUESTION) * 100;
    const timerColor = timeLeft > 15 ? '#10B981' : timeLeft > 7 ? '#F59E0B' : '#F43F5E';

    return (
      <Box sx={{ maxWidth: { xs: '100%', md: 840, lg: 900 }, mx: 'auto' }}>
        {/* Progress & Stat Bar */}
        <Box sx={{ mb: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                Question {currentIdx + 1} of {questions.length}
              </Typography>
              <Chip
                label={`Adaptive: ${currentDifficulty.toUpperCase()}`}
                size="small"
                sx={{
                  fontWeight: 800,
                  fontSize: '0.68rem',
                  bgcolor: alpha(difficultyColors[currentDifficulty] || '#6366F1', 0.15),
                  color: difficultyColors[currentDifficulty] || '#6366F1',
                  border: `1px solid ${alpha(difficultyColors[currentDifficulty] || '#6366F1', 0.3)}`,
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Chip
                label={`Correct: ${answers.filter((a) => a.isCorrect).length}`}
                size="small"
                sx={{
                  bgcolor: alpha('#10B981', 0.12),
                  color: '#10B981',
                  fontWeight: 800,
                  fontSize: '0.72rem',
                }}
              />
            </Box>
          </Box>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 7, borderRadius: 4 }} />
        </Box>

        {/* Question Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -25 }}
            transition={{ duration: 0.25 }}
          >
            <Card sx={{ border: (t) => `1px solid ${alpha(t.palette.primary.main, 0.2)}` }}>
              <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
                {/* Header with Circular Timer */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 3 }}>
                  <Box sx={{ position: 'relative', width: 56, height: 56 }}>
                    <CircularProgress
                      variant="determinate"
                      value={timerPercent}
                      size={56}
                      thickness={4.5}
                      sx={{ color: timerColor, position: 'absolute', top: 0, left: 0 }}
                    />
                    <CircularProgress
                      variant="determinate"
                      value={100}
                      size={56}
                      thickness={4.5}
                      sx={{ color: (t) => alpha(t.palette.divider, 0.4), position: 'absolute', top: 0, left: 0 }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: timerColor }}>
                        {timeLeft}s
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.4, fontSize: '1.05rem' }}>
                      {currentQ.question}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Domain: {currentQ.topic} • Multiple Choice Single Select
                    </Typography>
                  </Box>
                </Box>

                {/* Code Snippet if present */}
                {currentQ.codeSnippet && (
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: '10px',
                      bgcolor: (t) => (t.palette.mode === 'dark' ? '#070B13' : '#1E293B'),
                      color: '#E2E8F0',
                      fontFamily: 'monospace',
                      fontSize: '0.85rem',
                      mb: 2.5,
                      overflowX: 'auto',
                    }}
                  >
                    <pre style={{ margin: 0 }}>{currentQ.codeSnippet}</pre>
                  </Box>
                )}

                <Divider sx={{ mb: 2.5 }} />

                {/* Options List */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.3, mb: 3 }}>
                  {currentQ.options?.map((opt) => {
                    const isSelected = selectedAnswer === opt.id;
                    const isCorrect = opt.id === currentQ.correctAnswer;

                    let bg = 'transparent';
                    let border = 'divider';
                    let textColor = 'text.primary';

                    if (isAnswered) {
                      if (isCorrect) {
                        bg = alpha('#10B981', 0.16);
                        border = '#10B981';
                        textColor = '#10B981';
                      } else if (isSelected) {
                        bg = alpha('#F43F5E', 0.14);
                        border = '#F43F5E';
                        textColor = '#F43F5E';
                      }
                    } else if (isSelected) {
                      bg = alpha('#6366F1', 0.15);
                      border = '#6366F1';
                    }

                    return (
                      <Box
                        key={opt.id}
                        onClick={() => !isAnswered && handleAnswer(opt.id)}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.8,
                          p: 1.8,
                          borderRadius: '12px',
                          cursor: isAnswered ? 'default' : 'pointer',
                          border: '1.5px solid',
                          borderColor: border,
                          bgcolor: bg,
                          color: textColor,
                          transition: 'all 0.15s ease',
                          ...(!isAnswered && {
                            '&:hover': {
                              bgcolor: alpha('#6366F1', 0.08),
                              borderColor: '#6366F1',
                            },
                          }),
                        }}
                      >
                        <Box
                          sx={{
                            width: 30,
                            height: 30,
                            borderRadius: '50%',
                            border: '1.5px solid',
                            borderColor: 'inherit',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            fontWeight: 800,
                            fontSize: '0.75rem',
                          }}
                        >
                          {isAnswered && isCorrect ? (
                            <CheckCircle sx={{ fontSize: 18 }} />
                          ) : isAnswered && isSelected && !isCorrect ? (
                            <Cancel sx={{ fontSize: 18 }} />
                          ) : (
                            opt.id.toUpperCase()
                          )}
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: isAnswered && isCorrect ? 800 : 500, flex: 1 }}>
                          {opt.text}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>

                {/* Instant Feedback & Next CTA */}
                <AnimatePresence>
                  {isAnswered && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                      <Box
                        sx={{
                          p: 2.5,
                          borderRadius: '14px',
                          mb: 2.5,
                          bgcolor: feedback === 'correct' ? alpha('#10B981', 0.12) : alpha('#F43F5E', 0.12),
                          border: `1.5px solid ${feedback === 'correct' ? '#10B981' : '#F43F5E'}`,
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 800,
                            color: feedback === 'correct' ? '#10B981' : '#F43F5E',
                            mb: 0.5,
                          }}
                        >
                          {feedback === 'correct'
                            ? '✅ Excellent! Adaptive difficulty +1'
                            : `❌ Incorrect. Correct answer: ${
                                currentQ.options?.find((o) => o.id === currentQ.correctAnswer)?.text
                              }`}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                          {currentQ.explanation}
                        </Typography>
                      </Box>

                      <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        endIcon={<ArrowForward />}
                        onClick={handleNext}
                        sx={{ py: 1.5, fontWeight: 800 }}
                      >
                        {currentIdx + 1 >= questions.length ? 'Finalize & View Diagnostics' : 'Proceed to Next Question'}
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </Box>
    );
  }

  // ─── Results Screen ───────────────────────────────────────────────────────
  const grade = getGrade(score);
  const correct = answers.filter((a) => a.isCorrect).length;
  const incorrect = answers.length - correct;
  const avgTime =
    answers.length > 0
      ? Math.round(answers.reduce((acc, a) => acc + a.timeTaken, 0) / answers.length)
      : 0;

  return (
    <Box sx={{ maxWidth: { xs: '100%', md: 840, lg: 900 }, mx: 'auto' }}>
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
        <Card>
          <CardContent sx={{ p: { xs: 3, sm: 4.5 } }}>
            {/* Score Hero */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2.5, repeat: Infinity }}>
                <EmojiEvents sx={{ fontSize: 68, color: '#F59E0B', mb: 1 }} />
              </motion.div>
              <Typography variant="h2" sx={{ fontWeight: 900, color: grade.color, mb: 0.5 }}>
                {score}%
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
                {grade.label}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Completed Adaptive Quiz on <strong>{selectedTopic}</strong>
              </Typography>
            </Box>

            {/* Performance Metric Cards */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
              {[
                { label: 'Correct', value: correct, color: '#10B981', icon: '✅' },
                { label: 'Missed', value: incorrect, color: '#F43F5E', icon: '❌' },
                { label: 'Avg Speed', value: `${avgTime}s`, color: '#6366F1', icon: '⏱️' },
                { label: 'Accuracy', value: `${score}%`, color: '#F59E0B', icon: '🎯' },
              ].map((s) => (
                <Grid item xs={6} sm={3} key={s.label}>
                  <Box
                    sx={{
                      textAlign: 'center',
                      p: 2,
                      borderRadius: '14px',
                      bgcolor: alpha(s.color, 0.1),
                      border: `1px solid ${alpha(s.color, 0.25)}`,
                    }}
                  >
                    <Typography sx={{ fontSize: '1.4rem', mb: 0.5 }}>{s.icon}</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: s.color }}>
                      {s.value}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                      {s.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            {/* Detailed Question Review List */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.secondary' }}>
                  QUESTION-BY-QUESTION DIAGNOSTICS
                </Typography>
                {incorrect > 0 && (
                  <Button
                    size="small"
                    startIcon={<BookmarkAdd />}
                    onClick={handleSaveMissedQuestions}
                    disabled={savedMissed}
                    sx={{ fontSize: '0.75rem', fontWeight: 700 }}
                  >
                    {savedMissed ? 'Missed Questions Bookmarked!' : 'Bookmark All Missed'}
                  </Button>
                )}
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {answers.map((ans, i) => {
                  const q = questions.find((item) => item.id === ans.questionId);
                  return (
                    <Box
                      key={ans.questionId}
                      sx={{
                        p: 2,
                        borderRadius: '12px',
                        border: '1px solid',
                        borderColor: ans.isCorrect ? alpha('#10B981', 0.3) : alpha('#F43F5E', 0.3),
                        bgcolor: ans.isCorrect ? alpha('#10B981', 0.05) : alpha('#F43F5E', 0.05),
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography sx={{ fontWeight: 800, fontSize: '0.85rem' }}>
                          Q{i + 1}.
                        </Typography>
                        <Chip
                          label={ans.difficulty.toUpperCase()}
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: '0.62rem',
                            fontWeight: 700,
                            bgcolor: alpha(difficultyColors[ans.difficulty] || '#6366F1', 0.15),
                            color: difficultyColors[ans.difficulty] || '#6366F1',
                          }}
                        />
                        <Typography variant="caption" sx={{ color: 'text.secondary', ml: 'auto' }}>
                          {ans.timeTaken}s
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                        {q?.question}
                      </Typography>
                      <Typography variant="caption" sx={{ color: ans.isCorrect ? '#10B981' : '#F43F5E', display: 'block' }}>
                        {ans.isCorrect
                          ? '✓ Answered correctly'
                          : `✗ Correct answer was: ${q?.options?.find((o) => o.id === q.correctAnswer)?.text}`}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<Replay />}
                onClick={startQuiz}
                sx={{ py: 1.4, fontWeight: 800 }}
              >
                Retake Adaptive Quiz
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setPhase('setup')}
                sx={{ py: 1.4, fontWeight: 700 }}
              >
                Select Different Topic
              </Button>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default AdaptiveQuizPage;
