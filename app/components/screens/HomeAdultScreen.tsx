'use client';

import { motion } from 'framer-motion';
import { User, Users, BookOpen, Lock, Heart } from 'lucide-react';
import { MenuCard, Card } from '../ui';
import { Screen } from '../../types';

interface HomeAdultScreenProps {
  userName: string;
  onNavigate: (screen: Screen) => void;
}

export function HomeAdultScreen({ userName, onNavigate }: HomeAdultScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-5"
    >
      {/* Welcome Card */}
      <Card
        variant="default"
        padding="lg"
        className="mb-6 !bg-gradient-to-br !from-rose-50/80 !to-pink-50/80 !border-pink-100"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-start gap-3"
        >
          <Heart size={24} className="text-pink-500 mt-0.5 shrink-0" fill="#ec4899" />
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Bonjour {userName}
            </h2>
            <p className="text-sm text-gray-600">
              Explore ton profil de confort ou connecte-toi avec ton/ta partenaire.
            </p>
          </div>
        </motion.div>
      </Card>

      {/* Main Actions */}
      <div className="space-y-3">
        <MenuCard
          icon={<User size={26} className="text-white" />}
          title="Mon Espace"
          description="Explorer mes zones de confort"
          onClick={() => onNavigate('personal-space')}
          variant="pink"
          delay={1}
        />

        <MenuCard
          icon={<Users size={26} className="text-white" />}
          title="Notre Espace"
          description="Dialoguer avec mon/ma partenaire"
          onClick={() => onNavigate('duo-space')}
          variant="purple"
          delay={2}
        />

        <MenuCard
          icon={<BookOpen size={26} className="text-pink-600" />}
          title="Ressources"
          description="Guides et informations"
          onClick={() => onNavigate('learn')}
          delay={3}
        />
      </div>

      {/* Privacy Note */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 p-4 rounded-2xl bg-gray-50 border border-gray-100 text-center flex items-center justify-center gap-2"
      >
        <Lock size={14} className="text-gray-400" />
        <p className="text-xs text-gray-400">
          Tes données sont chiffrées et tu peux les supprimer à tout moment.
        </p>
      </motion.div>
    </motion.div>
  );
}
