'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, ChevronRight, RotateCcw, Trophy } from 'lucide-react';
import { quizQuestions } from '../../data';
import { Button } from '../ui';

export function QuizConsentementScreen() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = quizQuestions[current];
  const isCorrect = selected === question.correctIndex;
  const total = quizQuestions.length;

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
    if (score >= 7) return { label: 'Excellent !', color: '#22c55e', emoji: '🏆' };
    if (score >= 5) return { label: 'Bien !', color: '#3b82f6', emoji: '👍' };
    if (score >= 3) return { label: 'Pas mal', color: '#f59e0b', emoji: '📚' };
    return { label: 'À retravailler', color: '#ef4444', emoji: '💪' };
  };

  if (finished) {
    const result = getScoreLabel();
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-5 pb-10 flex flex-col items-center justify-center min-h-[70vh]"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          className="text-6xl mb-4"
        >
          {result.emoji}
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">{result.label}</h2>
        <p className="text-gray-500 mb-6">
          {score} bonne{score > 1 ? 's' : ''} réponse{score > 1 ? 's' : ''} sur {total}
        </p>
        <div className="w-48 h-3 bg-gray-100 rounded-full mb-8 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(score / total) * 100}%` }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-full rounded-full"
            style={{ backgroundColor: result.color }}
          />
        </div>
        {score < 7 && (
          <p className="text-sm text-gray-500 text-center max-w-xs mb-6">
            Relis les modules <strong>Porno vs. Réalité</strong> et <strong>La Loi</strong> pour mieux comprendre.
          </p>
        )}
        <Button onClick={handleReset} variant="secondary">
          <RotateCcw size={16} />
          Recommencer
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-5 pb-10"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-5">
        <div className="w-11 h-11 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0">
          <Gamepad2 size={22} className="text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Quiz</h2>
          <p className="text-sm text-gray-500">Question {current + 1} sur {total}</p>
        </div>
        <div className="ml-auto">
          <Trophy size={16} className="text-amber-400 inline mr-1" />
          <span className="text-sm font-bold text-gray-700">{score}</span>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="w-full h-2 bg-gray-100 rounded-full mb-6 overflow-hidden">
        <motion.div
          animate={{ width: `${((current) / total) * 100}%` }}
          transition={{ duration: 0.4 }}
          className="h-full rounded-full bg-blue-400"
        />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
        >
          <div className="mb-6 p-4 rounded-2xl bg-white shadow-sm border border-gray-100">
            <p className="text-base font-semibold text-gray-800 leading-snug">{question.question}</p>
          </div>

          {/* Options */}
          <div className="space-y-2.5 mb-5">
            {question.options.map((option, i) => {
              let bg = 'bg-white border-gray-100';
              let text = 'text-gray-700';
              if (confirmed) {
                if (i === question.correctIndex) { bg = 'bg-green-50 border-green-300'; text = 'text-green-800'; }
                else if (i === selected && selected !== question.correctIndex) { bg = 'bg-red-50 border-red-300'; text = 'text-red-700'; }
                else { bg = 'bg-white border-gray-100'; text = 'text-gray-400'; }
              } else if (selected === i) {
                bg = 'bg-blue-50 border-blue-300';
                text = 'text-blue-800';
              }

              return (
                <motion.button
                  key={i}
                  whileTap={confirmed ? {} : { scale: 0.98 }}
                  onClick={() => handleSelect(i)}
                  className={`w-full text-left p-3.5 rounded-xl border shadow-sm transition-all duration-200 ${bg}`}
                >
                  <span className={`text-sm font-medium ${text}`}>{option}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Explication après confirmation */}
          <AnimatePresence>
            {confirmed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`mb-4 p-4 rounded-2xl ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}
              >
                <p className="text-sm font-semibold mb-1" style={{ color: isCorrect ? '#166534' : '#991b1b' }}>
                  {isCorrect ? '✅ Bonne réponse !' : '❌ Pas tout à fait'}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: isCorrect ? '#14532d' : '#7f1d1d' }}>
                  {question.explanation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Boutons */}
          {!confirmed ? (
            <Button onClick={handleConfirm} fullWidth disabled={selected === null}>
              Valider
            </Button>
          ) : (
            <Button onClick={handleNext} fullWidth>
              {current + 1 < total ? 'Question suivante' : 'Voir mon score'}
              <ChevronRight size={18} />
            </Button>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
