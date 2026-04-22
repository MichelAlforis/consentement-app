'use client';

import { motion } from 'framer-motion';
import { Scale, AlertTriangle } from 'lucide-react';
import { loiPoints } from '../../data';

export function LoiConsentementScreen() {
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
        <div className="w-11 h-11 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
          <Scale size={22} className="text-amber-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">La loi & le consentement</h2>
          <p className="text-sm text-gray-500">Ce que tu risques. Ce qui te protège.</p>
        </div>
      </motion.div>

      {/* Alerte âge légal — card en évidence */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15 }}
        className="my-5 p-4 rounded-2xl border-2 border-amber-300 bg-amber-50"
      >
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle size={18} className="text-amber-600" />
          <span className="font-bold text-amber-800">À retenir absolument</span>
        </div>
        <p className="text-sm text-amber-900 leading-relaxed">
          En France, l'âge légal du consentement est <strong>15 ans</strong>. En dessous de cet âge, aucun rapport sexuel avec un adulte ne peut être légal — même si le jeune dit oui.
        </p>
      </motion.div>

      {/* Points de loi */}
      <div className="space-y-3">
        {loiPoints.map((point, i) => (
          <motion.div
            key={point.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.08 }}
            className={`p-4 rounded-2xl bg-white shadow-sm border ${point.important ? 'border-amber-200' : 'border-gray-100'}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0">{point.emoji}</span>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1 text-sm">{point.titre}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{point.contenu}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mention source */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-6 text-center"
      >
        <p className="text-xs text-gray-400">
          Contenu validé par notre co-fondateur juriste en droit pénal.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Code pénal français — Articles 222-22 et suivants
        </p>
      </motion.div>
    </motion.div>
  );
}
