import React, { useState } from 'react';
import {
  Card, CardContent, Typography, Box, Chip, Collapse,
  IconButton, Button, Tooltip, alpha, Divider,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  CheckCircle as CorrectIcon,
  Cancel as WrongIcon,
  LightbulbOutlined as ExplainIcon,
  ContentCopy as CopyIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Question } from '../../types';
import { useQuestions } from '../../context/QuestionContext';

interface QuestionCardProps {
  question: Question;
  index: number;
  showAnswer?: boolean;
  selectedAnswer?: string | null;
  onSelect?: (optionId: string) => void;
  isSubmitted?: boolean;
}

const difficultyColors: Record<string, string> = {
  easy: '#10B981',
  medium: '#F59E0B',
  hard: '#F43F5E',
};

const typeLabels: Record<string, string> = {
  mcq: 'MCQ',
  truefalse: 'True/False',
  fillinblank: 'Fill in Blank',
};

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  showAnswer = false,
  selectedAnswer,
  onSelect,
  isSubmitted = false,
}) => {
  const { savedQuestions, saveQuestion, unsaveQuestion } = useQuestions();
  const [showExplanation, setShowExplanation] = useState(false);
  const [localShowAnswer, setLocalShowAnswer] = useState(showAnswer);
  const [copied, setCopied] = useState(false);

  const isSaved = savedQuestions.some((q) => q.id === question.id) || question.isSaved;

  const handleSaveToggle = () => {
    if (isSaved) {
      unsaveQuestion(question.id);
    } else {
      saveQuestion(question);
    }
  };

  const handleCopyQuestion = () => {
    let text = `Q: ${question.question}\n`;
    if (question.codeSnippet) text += `\`\`\`\n${question.codeSnippet}\n\`\`\`\n`;
    if (question.options) {
      text += question.options.map((o) => `[${o.id.toUpperCase()}] ${o.text}`).join('\n') + '\n';
    }
    text += `Answer: ${question.correctAnswer}\nExplanation: ${question.explanation}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getOptionStyle = (optionId: string) => {
    if (!localShowAnswer && !isSubmitted) {
      if (selectedAnswer === optionId) {
        return {
          bgcolor: (t: any) => alpha(t.palette.primary.main, 0.15),
          borderColor: 'primary.main',
          cursor: 'pointer',
        };
      }
      return {
        cursor: 'pointer',
        '&:hover': {
          bgcolor: (t: any) => alpha(t.palette.primary.main, 0.08),
          borderColor: alpha('#6366F1', 0.4),
        },
      };
    }

    const isCorrect = optionId === question.correctAnswer;
    const isSelected = selectedAnswer === optionId;
    if (isCorrect) return { bgcolor: alpha('#10B981', 0.16), borderColor: '#10B981' };
    if (isSelected && !isCorrect) return { bgcolor: alpha('#F43F5E', 0.14), borderColor: '#F43F5E' };
    return { opacity: 0.5 };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
    >
      <Card
        sx={{
          mb: 2.5,
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            borderColor: alpha('#6366F1', 0.4),
            boxShadow: '0 8px 30px rgba(99,102,241,0.12)',
          },
          transition: 'all 0.25s ease',
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          {/* Card Meta Header */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
              <Chip
                label={`Q${index + 1}`}
                size="small"
                sx={{
                  bgcolor: (t) => alpha(t.palette.primary.main, 0.15),
                  color: 'primary.main',
                  fontWeight: 800,
                  fontSize: '0.72rem',
                }}
              />
              <Chip
                label={question.topic}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.72rem', fontWeight: 600, borderColor: 'divider' }}
              />
              <Chip
                label={question.difficulty.toUpperCase()}
                size="small"
                sx={{
                  bgcolor: alpha(difficultyColors[question.difficulty] || '#6366F1', 0.15),
                  color: difficultyColors[question.difficulty] || '#6366F1',
                  fontWeight: 700,
                  fontSize: '0.68rem',
                }}
              />
              <Chip
                label={typeLabels[question.type]}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.68rem', color: 'text.secondary', borderColor: 'divider' }}
              />
              {question.tags?.map((tag) => (
                <Chip
                  key={tag}
                  label={`#${tag}`}
                  size="small"
                  sx={{
                    fontSize: '0.65rem',
                    height: 20,
                    bgcolor: (t) => alpha(t.palette.divider, 0.5),
                    color: 'text.secondary',
                  }}
                />
              ))}
            </Box>

            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Tooltip title={copied ? 'Copied!' : 'Copy question'}>
                <IconButton size="small" onClick={handleCopyQuestion} sx={{ color: 'text.secondary' }}>
                  <CopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title={isSaved ? 'Remove from saved' : 'Save question'}>
                <IconButton
                  size="small"
                  onClick={handleSaveToggle}
                  sx={{ color: isSaved ? 'primary.main' : 'text.secondary' }}
                >
                  {isSaved ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Question Text */}
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 2, lineHeight: 1.6, fontSize: '0.98rem' }}>
            {question.question}
          </Typography>

          {/* Code Snippet Box (if applicable) */}
          {question.codeSnippet && (
            <Box
              sx={{
                mb: 2.5,
                p: 2,
                borderRadius: '10px',
                bgcolor: (t) => (t.palette.mode === 'dark' ? '#070B13' : '#1E293B'),
                color: '#E2E8F0',
                border: '1px solid rgba(255,255,255,0.08)',
                position: 'relative',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, opacity: 0.6 }}>
                <CodeIcon sx={{ fontSize: 16 }} />
                <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                  code_sample
                </Typography>
              </Box>
              <pre
                style={{
                  margin: 0,
                  fontFamily: "'Fira Code', 'Consolas', monospace",
                  fontSize: '0.84rem',
                  lineHeight: 1.5,
                  overflowX: 'auto',
                }}
              >
                {question.codeSnippet}
              </pre>
            </Box>
          )}

          {/* Multiple Choice Options */}
          {question.options && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, mb: 2 }}>
              {question.options.map((opt) => {
                const isCorrect = localShowAnswer && opt.id === question.correctAnswer;
                const isSelected = selectedAnswer === opt.id;
                return (
                  <Box
                    key={opt.id}
                    onClick={() => !localShowAnswer && !isSubmitted && onSelect?.(opt.id)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.8,
                      p: 1.6,
                      borderRadius: '12px',
                      border: '1.5px solid',
                      borderColor: 'divider',
                      transition: 'all 0.15s ease',
                      userSelect: 'none',
                      ...getOptionStyle(opt.id),
                    }}
                  >
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        border: '1.5px solid',
                        borderColor: isCorrect
                          ? '#10B981'
                          : isSelected && !localShowAnswer
                          ? 'primary.main'
                          : 'divider',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        bgcolor: isCorrect
                          ? alpha('#10B981', 0.2)
                          : isSelected && !localShowAnswer
                          ? (t: any) => alpha(t.palette.primary.main, 0.2)
                          : 'transparent',
                      }}
                    >
                      {isCorrect ? (
                        <CorrectIcon sx={{ fontSize: 16, color: '#10B981' }} />
                      ) : localShowAnswer && isSelected && !isCorrect ? (
                        <WrongIcon sx={{ fontSize: 16, color: '#F43F5E' }} />
                      ) : (
                        <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: 'text.secondary' }}>
                          {opt.id.toUpperCase()}
                        </Typography>
                      )}
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: isCorrect ? 700 : 400, flex: 1 }}>
                      {opt.text}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          )}

          {/* Fill in blank answer */}
          {question.type === 'fillinblank' && localShowAnswer && (
            <Box
              sx={{
                p: 1.8,
                borderRadius: '10px',
                bgcolor: alpha('#10B981', 0.1),
                border: '1px solid rgba(16,185,129,0.3)',
                mb: 2,
              }}
            >
              <Typography variant="body2" sx={{ color: '#10B981', fontWeight: 700 }}>
                ✓ Correct Answer: <strong>{question.correctAnswer}</strong>
              </Typography>
            </Box>
          )}

          <Divider sx={{ my: 1.5 }} />

          {/* Actions & Reveal */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            {!localShowAnswer && (
              <Button
                size="small"
                variant="outlined"
                onClick={() => setLocalShowAnswer(true)}
                sx={{ fontSize: '0.78rem', py: 0.6 }}
              >
                Reveal Answer
              </Button>
            )}
            <Button
              size="small"
              variant="outlined"
              startIcon={<ExplainIcon fontSize="small" />}
              onClick={() => setShowExplanation((v) => !v)}
              sx={{ fontSize: '0.78rem', py: 0.6 }}
            >
              {showExplanation ? 'Hide Explanation' : 'Explanation'}
            </Button>
            <IconButton
              size="small"
              onClick={() => setShowExplanation((v) => !v)}
              sx={{
                ml: 'auto',
                transform: showExplanation ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s',
              }}
            >
              <ExpandMoreIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Collapsible Explanation */}
          <Collapse in={showExplanation} timeout={300}>
            <Box
              sx={{
                mt: 2,
                p: 2.2,
                borderRadius: '12px',
                bgcolor: (t) => alpha(t.palette.primary.main, 0.05),
                border: (t) => `1px solid ${alpha(t.palette.primary.main, 0.15)}`,
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: 'primary.main', fontWeight: 800, mb: 0.8, display: 'block', letterSpacing: '0.04em' }}
              >
                💡 CONCEPT EXPLANATION & TAKEAWAY
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                {question.explanation}
              </Typography>
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default QuestionCard;
