'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { pornoVsRealite } from '../../data';

interface PornoVsRealiteScreenProps {
  onBack: () => void;
}

export function PornoVsRealiteScreen({ onBack }: PornoVsRealiteScreenProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-5 pb-10"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-3 mb-2"
      >
        <div className="w-11 h-11 rounded-2xl bg-violet-100 flex items-center justify-center shrink-0 mt-0.5">
          <Film size={22} className="text-violet-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Porno vs. Réalité</h2>
          <p className="text-sm text-gray-500">Ce que les films ne te montrent pas</p>
        </div>
      </motion.div>

      {/* Intro */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-6 p-4 rounded-2xl bg-violet-50 border border-violet-100"
      >
        <p className="text-sm text-violet-800 leading-relaxed">
          Le porno est un <strong>film de fiction</strong> tourné avec des acteurs. Il ne montre pas comment les vraies relations se passent — ni le consentement, ni la communication, ni les limites.
        </p>
      </motion.div>

      {/* Cartes comparaison */}
      <div className="space-y-3">
        {pornoVsRealite.map((item, i) => {
          const isOpen = expanded === item.id;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.07 }}
              className="rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100"
            >
              {/* En-tête toujours visible */}
              <button
                onClick={() => setExpanded(isOpen ? null : item.id)}
                className="w-full p-4 text-left"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    {/* Porno */}
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600 shrink-0 mt-0.5">
                        Dans le porno
                      </span>
                      <p className="text-sm text-gray-700">{item.porno}</p>
                    </div>
                    {/* Réalité */}
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 shrink-0 mt-0.5">
                        Dans la réalité
                      </span>
                      <p className="text-sm text-gray-700 font-medium">{item.realite}</p>
                    </div>
                  </div>
                  <div className="shrink-0 text-gray-300 mt-1">
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>
              </button>

              {/* Explication dépliable */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-1 border-t border-gray-50">
                      <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-3">
                        💡 {item.explication}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Message de clôture */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-6 p-4 rounded-2xl bg-blue-50 border border-blue-100"
      >
        <p className="text-sm text-blue-800 leading-relaxed text-center">
          <strong>La vraie sexualité, ça se construit avec communication, respect et consentement.</strong> Pas en imitant un film.
        </p>
      </motion.div>
    </motion.div>
  );
}
