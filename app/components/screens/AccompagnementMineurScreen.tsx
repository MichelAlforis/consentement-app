'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartHandshake, ChevronRight, Phone } from 'lucide-react';
import { Button } from '../ui';
import { Screen } from '../../types';

interface AccompagnementMineurScreenProps {
  onNavigate: (screen: Screen) => void;
}

type Step = 'intro' | 'age' | 'talked' | 'partner-ok' | 'resources' | 'guide';

interface StepState {
  age?: 'under15' | '15-17';
  talked?: boolean;
  partnerOk?: boolean;
}

export function AccompagnementMineurScreen({ onNavigate }: AccompagnementMineurScreenProps) {
  const [step, setStep] = useState<Step>('intro');
  const [state, setState] = useState<StepState>({});

  const updateAndGo = (updates: StepState, next: Step) => {
    setState(prev => ({ ...prev, ...updates }));
    setStep(next);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-5 pb-10"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-6">
        <div className="w-11 h-11 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0 mt-0.5">
          <HeartHandshake size={22} className="text-rose-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Je veux avoir un rapport</h2>
          <p className="text-sm text-gray-500">Des questions à se poser. Sans jugement.</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* INTRO */}
        {step === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 mb-6">
              <p className="text-sm text-rose-800 leading-relaxed">
                C'est normal de se poser des questions. Cet espace te guide — pas pour te dire quoi faire, mais pour t'aider à vérifier que tu es vraiment prêt·e.
              </p>
            </div>
            <p className="text-sm text-gray-500 mb-4">On va te poser quelques questions simples. Aucune réponse n'est enregistrée.</p>
            <Button onClick={() => setStep('age')} fullWidth>
              Commencer
              <ChevronRight size={18} />
            </Button>
          </motion.div>
        )}

        {/* ÂGE */}
        {step === 'age' && (
          <motion.div key="age" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <p className="text-base font-semibold text-gray-800 mb-6">Tu as quel âge ?</p>
            <div className="space-y-3">
              <button
                onClick={() => updateAndGo({ age: 'under15' }, 'resources')}
                className="w-full p-4 rounded-2xl bg-white border border-gray-100 shadow-sm text-left"
              >
                <p className="font-semibold text-gray-800">Moins de 15 ans</p>
                <p className="text-xs text-gray-400 mt-0.5">J'ai 14 ans ou moins</p>
              </button>
              <button
                onClick={() => updateAndGo({ age: '15-17' }, 'talked')}
                className="w-full p-4 rounded-2xl bg-white border border-gray-100 shadow-sm text-left"
              >
                <p className="font-semibold text-gray-800">15, 16 ou 17 ans</p>
                <p className="text-xs text-gray-400 mt-0.5">J'ai entre 15 et 17 ans</p>
              </button>
            </div>
          </motion.div>
        )}

        {/* MOINS DE 15 ANS → RESSOURCES DIRECTES */}
        {step === 'resources' && state.age === 'under15' && (
          <motion.div key="resources-under15" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 mb-5">
              <p className="text-sm font-semibold text-amber-800 mb-2">⚠️ Important à savoir</p>
              <p className="text-sm text-amber-700 leading-relaxed">
                En France, l'âge légal du consentement est <strong>15 ans</strong>. En dessous, tout rapport sexuel avec un adulte est un crime — même si tu dis oui. C'est la loi pour te protéger.
              </p>
            </div>
            <p className="text-sm text-gray-600 mb-5 leading-relaxed">
              Si tu te poses des questions sur ta sexualité, sur ce que tu ressens ou sur une situation qui t'a mis·e mal à l'aise, parler à un professionnel peut vraiment aider.
            </p>
            <div className="space-y-3 mb-5">
              <a href="tel:0800235236" className="flex items-center gap-3 p-4 rounded-2xl bg-teal-50 border border-teal-100">
                <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                  <Phone size={18} className="text-teal-600" />
                </div>
                <div>
                  <p className="font-semibold text-teal-800 text-sm">Fil Santé Jeunes</p>
                  <p className="text-xs text-teal-600">0 800 235 236 — Gratuit, anonyme</p>
                </div>
              </a>
            </div>
            <Button onClick={() => onNavigate('home-minor')} variant="secondary" fullWidth>
              Retour
            </Button>
          </motion.div>
        )}

        {/* A-T-ON EN PARLÉ ? */}
        {step === 'talked' && (
          <motion.div key="talked" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <p className="text-base font-semibold text-gray-800 mb-2">
              As-tu pu en parler à un adulte de confiance ?
            </p>
            <p className="text-sm text-gray-500 mb-6">Un parent, un médecin, une infirmière scolaire… quelqu'un en qui tu as confiance.</p>
            <div className="space-y-3">
              <button
                onClick={() => updateAndGo({ talked: true }, 'partner-ok')}
                className="w-full p-4 rounded-2xl bg-white border border-gray-100 shadow-sm text-left"
              >
                <p className="font-semibold text-gray-800">Oui, j'en ai parlé</p>
              </button>
              <button
                onClick={() => updateAndGo({ talked: false }, 'resources')}
                className="w-full p-4 rounded-2xl bg-white border border-gray-100 shadow-sm text-left"
              >
                <p className="font-semibold text-gray-800">Non, pas encore</p>
                <p className="text-xs text-gray-400 mt-0.5">Je te donne des ressources pour t'aider</p>
              </button>
            </div>
          </motion.div>
        )}

        {/* PAS ENCORE PARLÉ → RESSOURCES */}
        {step === 'resources' && state.talked === false && (
          <motion.div key="resources-no-talk" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 mb-5">
              <p className="text-sm text-blue-800 leading-relaxed">
                Ce n'est pas toujours facile d'en parler. Ces professionnels sont formés pour t'écouter sans te juger et gardent la confidentialité.
              </p>
            </div>
            <div className="space-y-3 mb-5">
              <a href="tel:0800235236" className="flex items-center gap-3 p-4 rounded-2xl bg-teal-50 border border-teal-100">
                <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                  <Phone size={18} className="text-teal-600" />
                </div>
                <div>
                  <p className="font-semibold text-teal-800 text-sm">Fil Santé Jeunes</p>
                  <p className="text-xs text-teal-600">0 800 235 236 — Gratuit, anonyme</p>
                </div>
              </a>
              <a href="tel:0800081111" className="flex items-center gap-3 p-4 rounded-2xl bg-green-50 border border-green-100">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <Phone size={18} className="text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-green-800 text-sm">Planning Familial</p>
                  <p className="text-xs text-green-600">0 800 08 11 11 — Gratuit</p>
                </div>
              </a>
            </div>
            <p className="text-xs text-gray-400 text-center mb-4">
              Parler à un professionnel ne t'engage à rien — c'est juste une conversation.
            </p>
            <Button onClick={() => updateAndGo({}, 'partner-ok')} fullWidth variant="secondary">
              Continuer quand même
              <ChevronRight size={18} />
            </Button>
          </motion.div>
        )}

        {/* TON PARTENAIRE EST-IL OK ? */}
        {step === 'partner-ok' && (
          <motion.div key="partner-ok" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <p className="text-base font-semibold text-gray-800 mb-2">
              Ton ou ta partenaire est-il/elle vraiment d'accord ?
            </p>
            <p className="text-sm text-gray-500 mb-4">Pas juste "il/elle n'a pas dit non" — mais vraiment d'accord, librement ?</p>
            <div className="space-y-3">
              <button
                onClick={() => updateAndGo({ partnerOk: true }, 'guide')}
                className="w-full p-4 rounded-2xl bg-white border border-gray-100 shadow-sm text-left"
              >
                <p className="font-semibold text-gray-800">Oui, on en a parlé ensemble</p>
              </button>
              <button
                onClick={() => updateAndGo({ partnerOk: false }, 'resources')}
                className="w-full p-4 rounded-2xl bg-white border border-gray-100 shadow-sm text-left"
              >
                <p className="font-semibold text-gray-800">Je ne suis pas sûr·e</p>
                <p className="text-xs text-gray-400 mt-0.5">Si c'est incertain, c'est qu'on n'est pas prêt·e</p>
              </button>
            </div>
          </motion.div>
        )}

        {/* GUIDE FINAL */}
        {step === 'guide' && (
          <motion.div key="guide" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="p-4 rounded-2xl bg-green-50 border border-green-200 mb-5">
              <p className="text-sm font-semibold text-green-800 mb-2">✅ Tu sembles prêt·e</p>
              <p className="text-sm text-green-700 leading-relaxed">
                Tu as coché les cases importantes. Rappelle-toi que le consentement est continu — les deux personnes doivent rester à l'aise tout au long.
              </p>
            </div>
            <div className="space-y-2 mb-6">
              {[
                'Vous pouvez vous arrêter à n\'importe quel moment',
                'Dire non ou "stop" doit être respecté immédiatement',
                'Si quelque chose fait mal, dites-le',
                'La première fois est rarement comme dans les films',
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-white border border-gray-100">
                  <span className="text-green-500 mt-0.5 shrink-0">•</span>
                  <p className="text-sm text-gray-700">{tip}</p>
                </div>
              ))}
            </div>
            <Button onClick={() => onNavigate('home-minor')} fullWidth variant="secondary">
              Retour à l'accueil
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
