'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, ChevronRight, RotateCcw, Trophy, ThumbsUp, BookOpen, Flame, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import { quizQuestions } from '../../data';
import { Button } from '../ui';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n';
import { useModuleComplete } from '../../lib/useModuleComplete';

interface QuizConsentementScreenProps {
  onComplete?: () => void;
}

export function QuizConsentementScreen({ onComplete }: QuizConsentementScreenProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const complete = useModuleComplete();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = quizQuestions[current];
  const isCorrect = selected === question.correctIndex;
  const total = quizQuestions.length;

  const questionText = t(`quiz.${current}.question`);
  const optionTexts = [0, 1, 2, 3].map(i => t(`quiz.${current}.options.${i}`));
  const explanationText = t(`quiz.${current}.explanation`);

  const handleSelect = (index: number) => {
    if (confirmed) return;
    setSelected(index);
  };

  const handleConfirm = () => {
    if (selected === null) return;
    setConfirmed(true);
    if (selected === question.correctIndex) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (current + 1 >= total) {
      complete('quiz-consentement');
      setFinished(true);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setConfirmed(false);
    }
  };

  const handleReset = () => {
    setCurrent(0);
    setSelected(null);
    setConfirmed(false);
    setScore(0);
    setFinished(false);
  };

  const getScoreLabel = () => {
    if (score >= 7) return { label: t('quizScreen.scoreLabels.excellent'), color: '#22c55e', Icon: Trophy };
    if (score >= 5) return { label: t('quizScreen.scoreLabels.good'), color: '#3b82f6', Icon: ThumbsUp };
    if (score >= 3) return { label: t('quizScreen.scoreLabels.notBad'), color: '#f59e0b', Icon: BookOpen };
    return { label: t('quizScreen.scoreLabels.retry'), color: '#ef4444', Icon: Flame };
  };

  if (finished) {
    const result = getScoreLabel();
    const plural = score > 1 ? 's' : '';
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex-1 flex flex-col items-center justify-center p-5"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          className="mb-4"
        >
          <result.Icon size={64} color={result.color} />
        </motion.div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>{result.label}</h2>
        <p className="mb-6" style={{ color: colors.textMuted }}>
          {t('quizScreen.score', { score: String(score), total: String(total), plural })}
        </p>
        <div className="w-48 h-3 rounded-full mb-8 overflow-hidden" style={{ background: colors.bgSecondary }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(score / total) * 100}%` }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-full rounded-full"
            style={{ backgroundColor: result.color }}
          />
        </div>
        {score < 7 && (
          <p className="text-sm text-center max-w-xs mb-6" style={{ color: colors.textMuted }}>
            {t('quizScreen.adviceReread')}
          </p>
        )}
        <Button onClick={handleReset} variant="secondary">
          <RotateCcw size={16} />
          {t('quizScreen.restart')}
        </Button>
        {onComplete && (
          <Button onClick={onComplete} className="mt-3">
            <Sparkles size={16} />
            {t('quizScreen.seeCard')}
          </Button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-5"
    >
      <div className="flex items-start gap-3 mb-5">
        <div className="w-11 h-11 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0">
          <Gamepad2 size={22} className="text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>{t('quizScreen.title')}</h2>
          <p className="text-sm" style={{ color: colors.textMuted }}>
            {t('quizScreen.question', { current: String(current + 1), total: String(total) })}
          </p>
        </div>
        <div className="ml-auto">
          <Trophy size={16} className="text-amber-400 inline mr-1" />
          <span className="text-sm font-bold" style={{ color: colors.textSecondary }}>{score}</span>
        </div>
      </div>

      <div className="w-full h-2 rounded-full mb-6 overflow-hidden" style={{ background: colors.bgSecondary }}>
        <motion.div
          animate={{ width: `${(current / total) * 100}%` }}
          transition={{ duration: 0.4 }}
          className="h-full rounded-full bg-blue-400"
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
        >
          <div className="mb-6 p-4 rounded-2xl shadow-sm border" style={{ background: colors.bgCard, borderColor: colors.border }}>
            <p className="text-base font-semibold leading-snug" style={{ color: colors.textPrimary }}>{questionText}</p>
          </div>

          <div className="space-y-2.5 mb-5">
            {optionTexts.map((option, i) => {
              let bgClass = '';
              let borderClass = '';
              let textColor = colors.textSecondary;
              let optionStyle: React.CSSProperties = { background: colors.bgCard, borderColor: colors.border };
              if (confirmed) {
                if (i === question.correctIndex) { bgClass = 'bg-green-50'; borderClass = 'border-green-300'; textColor = '#166534'; optionStyle = {}; }
                else if (i === selected && selected !== question.correctIndex) { bgClass = 'bg-red-50'; borderClass = 'border-red-300'; textColor = '#991b1b'; optionStyle = {}; }
                else { textColor = colors.textMuted; }
              } else if (selected === i) {
                bgClass = 'bg-blue-50'; borderClass = 'border-blue-300'; textColor = '#1e40af'; optionStyle = {};
              }

              return (
                <motion.button
                  key={i}
                  whileTap={confirmed ? {} : { scale: 0.98 }}
                  onClick={() => handleSelect(i)}
                  className={`w-full text-left p-3.5 rounded-xl border shadow-sm transition-all duration-200 ${bgClass} ${borderClass}`}
                  style={optionStyle}
                >
                  <span className="text-sm font-medium" style={{ color: textColor }}>{option}</span>
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {confirmed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`mb-4 p-4 rounded-2xl ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}
              >
                <p className="text-sm font-semibold mb-1 flex items-center gap-1.5" style={{ color: isCorrect ? '#166534' : '#991b1b' }}>
                  {isCorrect ? <CheckCircle size={15} className="shrink-0" /> : <XCircle size={15} className="shrink-0" />}
                  {isCorrect ? t('quizScreen.correct') : t('quizScreen.incorrect')}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: isCorrect ? '#14532d' : '#7f1d1d' }}>
                  {explanationText}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {!confirmed ? (
            <Button onClick={handleConfirm} fullWidth disabled={selected === null}>
              {t('quizScreen.validate')}
            </Button>
          ) : (
            <Button onClick={handleNext} fullWidth>
              {current + 1 < total ? t('quizScreen.next') : t('quizScreen.finish')}
              <ChevronRight size={18} />
            </Button>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
