'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartHandshake, ChevronRight, Phone, AlertTriangle, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '../ui';
import { Screen } from '../../types';
import { useTranslation } from '../../i18n';
import { useModuleComplete } from '../../lib/useModuleComplete';

interface AccompagnementMineurScreenProps {
  onNavigate: (screen: Screen) => void;
  onComplete?: () => void;
}

type Step = 'intro' | 'age' | 'talked' | 'partner-ok' | 'resources' | 'guide';

interface StepState {
  age?: 'under15' | '15-17';
  talked?: boolean;
  partnerOk?: boolean;
}

export function AccompagnementMineurScreen({ onNavigate, onComplete }: AccompagnementMineurScreenProps) {
  const { t } = useTranslation();
  const complete = useModuleComplete();
  const [step, setStep] = useState<Step>('intro');
  const [state, setState] = useState<StepState>({});

  const updateAndGo = (updates: StepState, next: Step) => {
    setState(prev => ({ ...prev, ...updates }));
    setStep(next);
  };

  const tips = [
    t('accompagnement.guide.tip1'),
    t('accompagnement.guide.tip2'),
    t('accompagnement.guide.tip3'),
    t('accompagnement.guide.tip4'),
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-5 pb-10"
    >
      <div className="flex items-start gap-3 mb-6">
        <div className="w-11 h-11 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0 mt-0.5">
          <HeartHandshake size={22} className="text-rose-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">{t('accompagnement.title')}</h2>
          <p className="text-sm text-gray-500">{t('accompagnement.subtitle')}</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 mb-6">
              <p className="text-sm text-rose-800 leading-relaxed">
                {t('accompagnement.intro.text')}
              </p>
            </div>
            <p className="text-sm text-gray-500 mb-4">{t('accompagnement.intro.note')}</p>
            <Button onClick={() => setStep('age')} fullWidth>
              {t('accompagnement.intro.cta')}
              <ChevronRight size={18} />
            </Button>
          </motion.div>
        )}

        {step === 'age' && (
          <motion.div key="age" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <p className="text-base font-semibold text-gray-800 mb-6">{t('accompagnement.age.question')}</p>
            <div className="space-y-3">
              <button
                onClick={() => updateAndGo({ age: 'under15' }, 'resources')}
                className="w-full p-4 rounded-2xl bg-white border border-gray-100 shadow-sm text-left"
              >
                <p className="font-semibold text-gray-800">{t('accompagnement.age.under15.title')}</p>
                <p className="text-xs text-gray-400 mt-0.5">{t('accompagnement.age.under15.desc')}</p>
              </button>
              <button
                onClick={() => updateAndGo({ age: '15-17' }, 'talked')}
                className="w-full p-4 rounded-2xl bg-white border border-gray-100 shadow-sm text-left"
              >
                <p className="font-semibold text-gray-800">{t('accompagnement.age.between.title')}</p>
                <p className="text-xs text-gray-400 mt-0.5">{t('accompagnement.age.between.desc')}</p>
              </button>
            </div>
          </motion.div>
        )}

        {step === 'resources' && state.age === 'under15' && (
          <motion.div key="resources-under15" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 mb-5">
              <p className="text-sm font-semibold text-amber-800 mb-2 flex items-center gap-1.5">
                <AlertTriangle size={15} className="shrink-0" />
                {t('accompagnement.under15Alert.title')}
              </p>
              <p
                className="text-sm text-amber-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: t('accompagnement.under15Alert.text') }}
              />
            </div>
            <p className="text-sm text-gray-600 mb-5 leading-relaxed">
              {t('accompagnement.under15Alert.sub')}
            </p>
            <div className="space-y-3 mb-5">
              <a href="tel:0800235236" className="flex items-center gap-3 p-4 rounded-2xl bg-teal-50 border border-teal-100">
                <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                  <Phone size={18} className="text-teal-600" />
                </div>
                <div>
                  <p className="font-semibold text-teal-800 text-sm">{t('accompagnement.filSanteJeunes')}</p>
                  <p className="text-xs text-teal-600">{t('accompagnement.filSanteContact')}</p>
                </div>
              </a>
            </div>
            <Button onClick={() => onNavigate('home')} variant="secondary" fullWidth>
              {t('accompagnement.backHome')}
            </Button>
          </motion.div>
        )}

        {step === 'talked' && (
          <motion.div key="talked" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <p className="text-base font-semibold text-gray-800 mb-2">
              {t('accompagnement.talked.question')}
            </p>
            <p className="text-sm text-gray-500 mb-6">{t('accompagnement.talked.sub')}</p>
            <div className="space-y-3">
              <button
                onClick={() => updateAndGo({ talked: true }, 'partner-ok')}
                className="w-full p-4 rounded-2xl bg-white border border-gray-100 shadow-sm text-left"
              >
                <p className="font-semibold text-gray-800">{t('accompagnement.talked.yes')}</p>
              </button>
              <button
                onClick={() => updateAndGo({ talked: false }, 'resources')}
                className="w-full p-4 rounded-2xl bg-white border border-gray-100 shadow-sm text-left"
              >
                <p className="font-semibold text-gray-800">{t('accompagnement.talked.no')}</p>
                <p className="text-xs text-gray-400 mt-0.5">{t('accompagnement.talked.noDec')}</p>
              </button>
            </div>
          </motion.div>
        )}

        {step === 'resources' && state.talked === false && (
          <motion.div key="resources-no-talk" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 mb-5">
              <p className="text-sm text-blue-800 leading-relaxed">
                {t('accompagnement.notTalkedYet')}
              </p>
            </div>
            <div className="space-y-3 mb-5">
              <a href="tel:0800235236" className="flex items-center gap-3 p-4 rounded-2xl bg-teal-50 border border-teal-100">
                <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                  <Phone size={18} className="text-teal-600" />
                </div>
                <div>
                  <p className="font-semibold text-teal-800 text-sm">{t('accompagnement.filSanteJeunes')}</p>
                  <p className="text-xs text-teal-600">{t('accompagnement.filSanteContact')}</p>
                </div>
              </a>
              <a href="tel:0800081111" className="flex items-center gap-3 p-4 rounded-2xl bg-green-50 border border-green-100">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <Phone size={18} className="text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-green-800 text-sm">{t('accompagnement.planningFamilial')}</p>
                  <p className="text-xs text-green-600">{t('accompagnement.planningFamilialContact')}</p>
                </div>
              </a>
            </div>
            <p className="text-xs text-gray-400 text-center mb-4">
              {t('accompagnement.resourcesNote')}
            </p>
            <Button onClick={() => updateAndGo({}, 'partner-ok')} fullWidth variant="secondary">
              {t('accompagnement.continueAnyway')}
              <ChevronRight size={18} />
            </Button>
          </motion.div>
        )}

        {step === 'partner-ok' && (
          <motion.div key="partner-ok" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <p className="text-base font-semibold text-gray-800 mb-2">
              {t('accompagnement.partnerOk.question')}
            </p>
            <p className="text-sm text-gray-500 mb-4">{t('accompagnement.partnerOk.sub')}</p>
            <div className="space-y-3">
              <button
                onClick={() => updateAndGo({ partnerOk: true }, 'guide')}
                className="w-full p-4 rounded-2xl bg-white border border-gray-100 shadow-sm text-left"
              >
                <p className="font-semibold text-gray-800">{t('accompagnement.partnerOk.yes')}</p>
              </button>
              <button
                onClick={() => updateAndGo({ partnerOk: false }, 'resources')}
                className="w-full p-4 rounded-2xl bg-white border border-gray-100 shadow-sm text-left"
              >
                <p className="font-semibold text-gray-800">{t('accompagnement.partnerOk.unsure')}</p>
                <p className="text-xs text-gray-400 mt-0.5">{t('accompagnement.partnerOk.unsureDec')}</p>
              </button>
            </div>
          </motion.div>
        )}

        {step === 'guide' && (
          <motion.div key="guide" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="p-4 rounded-2xl bg-green-50 border border-green-200 mb-5">
              <p className="text-sm font-semibold text-green-800 mb-2 flex items-center gap-1.5">
                <CheckCircle size={15} className="shrink-0" />
                {t('accompagnement.guide.ready')}
              </p>
              <p className="text-sm text-green-700 leading-relaxed">
                {t('accompagnement.guide.readyDesc')}
              </p>
            </div>
            <div className="space-y-2 mb-6">
              {tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-white border border-gray-100">
                  <span className="text-green-500 mt-0.5 shrink-0">•</span>
                  <p className="text-sm text-gray-700">{tip}</p>
                </div>
              ))}
            </div>
            {onComplete && (
              <Button
                onClick={() => { complete('accompagnement-mineur'); onComplete(); }}
                fullWidth
                className="mb-3"
              >
                <Sparkles size={16} />
                {t('accompagnement.guide.seeCard')}
              </Button>
            )}
            <Button onClick={() => onNavigate('home')} fullWidth variant="secondary">
              {t('accompagnement.guide.backHome')}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
