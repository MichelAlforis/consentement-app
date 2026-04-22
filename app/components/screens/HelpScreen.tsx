'use client';

import { motion } from 'framer-motion';
import { LifeBuoy, Phone, Heart, AlertTriangle, Shield, MessageSquare, Ambulance } from 'lucide-react';
import { Card } from '../ui';
import { helpResources } from '../../data';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n';

export function HelpScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const alsoTalkItems = [
    t('help.alsoTalk.item1'),
    t('help.alsoTalk.item2'),
    t('help.alsoTalk.item3'),
    t('help.alsoTalk.item4'),
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-5"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-start gap-3"
      >
        <LifeBuoy size={28} className="text-teal-500 mt-1 shrink-0" />
        <div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>
            {t('help.title')}
          </h2>
          <p className="text-sm" style={{ color: colors.textMuted }}>
            {t('help.subtitle')}
          </p>
        </div>
      </motion.div>

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
                <h3 className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
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
                <p className="text-sm mt-2" style={{ color: colors.textMuted }}>
                  {t(`helpResources.${index}.desc`)}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6"
      >
        <Card variant="default" padding="lg">
          <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: colors.textSecondary }}>
            <Heart size={18} className="text-blue-500" />
            {t('help.alsoTalk.title')}
          </h4>
          <ul className="space-y-2 text-sm" style={{ color: colors.textSecondary }}>
            {alsoTalkItems.map((item, i) => (
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-4"
      >
        <Card variant="warning" padding="lg">
          <p className="font-semibold flex items-center gap-2" style={{ color: colors.textPrimary }}>
            <AlertTriangle size={18} className="text-amber-600" />
            {t('help.emergency.title')}
          </p>
          <div className="flex gap-4 mt-3">
            <motion.a
              href="tel:17"
              whileTap={{ scale: 0.95 }}
              className="flex-1 rounded-xl py-3 text-center flex flex-col items-center"
              style={{ background: colors.bgCard }}
            >
              <Shield size={20} className="text-red-500 mb-1" />
              <span className="block text-2xl font-bold text-red-500">17</span>
              <span className="text-xs" style={{ color: colors.textSecondary }}>{t('help.emergency.police')}</span>
            </motion.a>
            <motion.a
              href="tel:15"
              whileTap={{ scale: 0.95 }}
              className="flex-1 rounded-xl py-3 text-center flex flex-col items-center"
              style={{ background: colors.bgCard }}
            >
              <Ambulance size={20} className="text-red-500 mb-1" />
              <span className="block text-2xl font-bold text-red-500">15</span>
              <span className="text-xs" style={{ color: colors.textSecondary }}>{t('help.emergency.samu')}</span>
            </motion.a>
            <motion.a
              href="tel:114"
              whileTap={{ scale: 0.95 }}
              className="flex-1 rounded-xl py-3 text-center flex flex-col items-center"
              style={{ background: colors.bgCard }}
            >
              <MessageSquare size={20} className="text-red-500 mb-1" />
              <span className="block text-2xl font-bold text-red-500">114</span>
              <span className="text-xs" style={{ color: colors.textSecondary }}>{t('help.emergency.sms')}</span>
            </motion.a>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
