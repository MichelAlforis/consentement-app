'use client';

import { motion } from 'framer-motion';
import { LifeBuoy, Phone, Heart, AlertTriangle, Shield, MessageSquare, Ambulance } from 'lucide-react';
import { Card } from '../ui';
import { helpResources } from '../../data';

export function HelpScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-5"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-start gap-3"
      >
        <LifeBuoy size={28} className="text-teal-500 mt-1 shrink-0" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Besoin d'aide ?
          </h2>
          <p className="text-sm text-gray-500">
            Tu n'es pas seul·e. Des personnes sont là pour t'écouter.
          </p>
        </div>
      </motion.div>

      {/* Resources */}
      <div className="space-y-3">
        {helpResources.map((resource, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card variant="elevated" padding="none" className="overflow-hidden">
              <div
                className="absolute left-0 top-0 bottom-0 w-1.5"
                style={{ backgroundColor: resource.color }}
              />
              <div className="p-5 pl-6">
                <h3 className="font-semibold text-gray-800 mb-1">
                  {resource.name}
                </h3>
                <motion.a
                  href={`tel:${resource.phone.replace(/\s/g, '')}`}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 text-xl font-bold mt-1"
                  style={{ color: resource.color }}
                >
                  <Phone size={20} />
                  {resource.phone}
                </motion.a>
                <p className="text-sm text-gray-500 mt-2">
                  {resource.desc}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Additional help */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6"
      >
        <Card variant="default" padding="lg">
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Heart size={18} className="text-blue-500" />
            Tu peux aussi parler à...
          </h4>
          <ul className="space-y-2 text-sm text-gray-600">
            {[
              'Un adulte de confiance',
              'Un·e infirmier·e scolaire',
              'Un·e CPE',
              'Le médecin de famille'
            ].map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className="flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                {item}
              </motion.li>
            ))}
          </ul>
        </Card>
      </motion.div>

      {/* Emergency */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-4"
      >
        <Card variant="gradient-amber" padding="lg">
          <p className="font-semibold text-gray-800 flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-600" />
            En cas d'urgence
          </p>
          <div className="flex gap-4 mt-3">
            <motion.a
              href="tel:17"
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-white/80 rounded-xl py-3 text-center flex flex-col items-center"
            >
              <Shield size={20} className="text-red-500 mb-1" />
              <span className="block text-2xl font-bold text-red-500">17</span>
              <span className="text-xs text-gray-600">Police</span>
            </motion.a>
            <motion.a
              href="tel:15"
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-white/80 rounded-xl py-3 text-center flex flex-col items-center"
            >
              <Ambulance size={20} className="text-red-500 mb-1" />
              <span className="block text-2xl font-bold text-red-500">15</span>
              <span className="text-xs text-gray-600">SAMU</span>
            </motion.a>
            <motion.a
              href="tel:114"
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-white/80 rounded-xl py-3 text-center flex flex-col items-center"
            >
              <MessageSquare size={20} className="text-red-500 mb-1" />
              <span className="block text-2xl font-bold text-red-500">114</span>
              <span className="text-xs text-gray-600">SMS</span>
            </motion.a>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
