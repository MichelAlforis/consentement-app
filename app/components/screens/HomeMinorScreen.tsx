'use client';

import { motion } from 'framer-motion';
import { BookOpen, MessageCircle, Smile, LifeBuoy, Lock, Sparkles } from 'lucide-react';
import { MenuCard, Card } from '../ui';
import { Screen } from '../../types';

interface HomeMinorScreenProps {
  onNavigate: (screen: Screen) => void;
}

export function HomeMinorScreen({ onNavigate }: HomeMinorScreenProps) {
  const menuItems = [
    { screen: 'learn' as Screen, icon: <BookOpen size={26} className="text-pink-600" />, title: 'Comprendre', desc: 'Le consentement expliqué' },
    { screen: 'scenarios-minor' as Screen, icon: <MessageCircle size={26} className="text-pink-600" />, title: 'Situations', desc: 'Que ferais-tu si...' },
    { screen: 'feelings' as Screen, icon: <Smile size={26} className="text-pink-600" />, title: 'Mes ressentis', desc: 'Explorer mes limites' },
    { screen: 'help' as Screen, icon: <LifeBuoy size={26} className="text-white" />, title: 'Aide', desc: 'Ressources et contacts' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-5"
    >
      {/* Welcome Card */}
      <Card variant="gradient-green" padding="lg" className="mb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-start gap-3"
        >
          <Sparkles size={24} className="text-emerald-600 mt-0.5 shrink-0" />
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Ton espace
            </h2>
            <p className="text-sm text-gray-600">
              Explore, apprends, réfléchis. Rien n'est enregistré.
            </p>
          </div>
        </motion.div>
      </Card>

      {/* Menu Items */}
      <div className="space-y-3">
        {menuItems.map((item, index) => (
          <MenuCard
            key={item.screen}
            icon={item.icon}
            title={item.title}
            description={item.desc}
            onClick={() => onNavigate(item.screen)}
            variant={item.screen === 'help' ? 'green' : 'default'}
            delay={index + 1}
          />
        ))}
      </div>

      {/* Bottom note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 text-center flex items-center justify-center gap-2"
      >
        <Lock size={14} className="text-gray-400" />
        <p className="text-xs text-gray-400">
          Cet espace est 100% privé
        </p>
      </motion.div>
    </motion.div>
  );
}
