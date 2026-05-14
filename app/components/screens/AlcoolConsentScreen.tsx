'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuizModuleScreen } from './QuizModuleScreen';
import { LoiModuleScreen } from './LoiModuleScreen';
import { alcoolConsentQuiz, alcoolConsentLoiPoints } from '../../data/alcoolConsent';
import type { ModuleId } from '../../modules';

interface AlcoolConsentScreenProps {
  moduleId?: ModuleId;
  onComplete?: () => void;
}

export function AlcoolConsentScreen({ moduleId = 'alcool-consent', onComplete }: AlcoolConsentScreenProps) {
  const [phase, setPhase] = useState<'quiz' | 'loi'>('quiz');

  return (
    <AnimatePresence mode="wait">
      {phase === 'quiz' ? (
        <motion.div key="quiz"
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.28 }} className="flex-1 flex flex-col"
        >
          <QuizModuleScreen
            questions={alcoolConsentQuiz}
            namespace="alcoolConsent.quiz"
            moduleId={moduleId}
            skipComplete
            onComplete={() => setPhase('loi')}
          />
        </motion.div>
      ) : (
        <motion.div key="loi"
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.28 }} className="flex-1 flex flex-col"
        >
          <LoiModuleScreen
            items={alcoolConsentLoiPoints}
            namespace="alcoolConsent.loi"
            moduleId={moduleId}
            onComplete={onComplete}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
