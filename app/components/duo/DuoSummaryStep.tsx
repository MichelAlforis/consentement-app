'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, MessageCircle, AlertTriangle, ChevronDown, ChevronUp, Check, PenLine, Sparkles } from 'lucide-react';
import { AppLogo } from '../ui';
import { Card } from '../ui';
import { comfortCategories } from '../../data';
import { DynamicIcon } from '../../utils/iconFromName';
import { CommonGround, PersonalProfile } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n';

const PREF_TOPIC_LABELS: Record<string, string> = {
  'topic-fellation':             'duo.summary.pref_fellation',
  'topic-cunnilingus':           'duo.summary.pref_cunnilingus',
  'topic-masturbation-mutuelle': 'duo.summary.pref_masturbation_mutuelle',
  'topic-penetration':           'duo.summary.pref_penetration',
  'topic-sodomie':               'duo.summary.pref_sodomie',
};

interface DuoSummaryStepProps {
  commonGround: CommonGround;
  personalProfile: PersonalProfile;
  partnerName: string;
  partnerSafeword: string;
  preferenceMatches?: string[];
}

type CategoryKey = 'tenderness' | 'intensity' | 'trust';
const categoryKeys: CategoryKey[] = ['tenderness', 'intensity', 'trust'];

export function DuoSummaryStep({
  commonGround,
  personalProfile,
  partnerName,
  partnerSafeword,
  preferenceMatches = [],
}: DuoSummaryStepProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [expandedCategories, setExpandedCategories] = useState<CategoryKey[]>(['tenderness']);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  const toggleCategory = (key: CategoryKey) => {
    setExpandedCategories(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const totalCommon = categoryKeys.reduce((acc, key) => {
    const count = comfortCategories[key].items.filter(
      item => commonGround[key][item.id]?.compatible
    ).length;
    return acc + count;
  }, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-5 py-6"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="mx-auto mb-4 flex justify-center"
        >
          <AppLogo className="w-16 h-16" variant="theme" animated={true} />
        </motion.div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>
          {t('duo.summary.title')}
        </h2>
        <p style={{ color: colors.textMuted }}>
          {totalCommon} {totalCommon > 1 ? t('duo.summary.zones') : t('duo.summary.zone')}
        </p>
      </motion.div>

      <div className="space-y-3 mb-6">
        {categoryKeys.map((key, catIndex) => {
          const category = comfortCategories[key];
          const isExpanded = expandedCategories.includes(key);
          const compatibleItems = category.items.filter(
            item => commonGround[key][item.id]?.compatible
          );

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIndex * 0.1 }}
            >
              <Card variant="elevated" padding="none" className="overflow-hidden">
                <button
                  onClick={() => toggleCategory(key)}
                  className="w-full px-4 py-3 flex items-center justify-between transition-colors"
                  style={{ background: `linear-gradient(135deg, ${category.color}10 0%, transparent 100%)` }}
                >
                  <div className="flex items-center gap-3">
                    <DynamicIcon name={category.iconName} size={20} />
                    <span className="font-medium" style={{ color: colors.textPrimary }}>
                      {t(`comfort.${key}.title`)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm px-2 py-0.5 rounded-full" style={{ color: colors.textMuted, background: colors.bgCard }}>
                      {compatibleItems.length}
                    </span>
                    {isExpanded ? (
                      <ChevronUp size={18} style={{ color: colors.textMuted }} />
                    ) : (
                      <ChevronDown size={18} style={{ color: colors.textMuted }} />
                    )}
                  </div>
                </button>

                <motion.div
                  initial={false}
                  animate={{ height: isExpanded ? 'auto' : 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 pt-2 space-y-2">
                    {compatibleItems.length > 0 ? (
                      compatibleItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 py-2 last:border-0"
                          style={{ borderBottom: `1px solid ${colors.border}` }}
                        >
                          <DynamicIcon name={item.iconName} size={18} />
                          <span className="flex-1 text-sm" style={{ color: colors.textSecondary }}>
                            {t(`comfort.${key}.items.${item.id}`)}
                          </span>
                          <Check size={18} className="text-green-500" />
                        </div>
                      ))
                    ) : (
                      <p className="text-sm italic py-2" style={{ color: colors.textMuted }}>
                        {t('duo.summary.noZones')}
                      </p>
                    )}
                  </div>
                </motion.div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {preferenceMatches.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-6"
        >
          <Card variant="default" padding="lg">
            <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: colors.textPrimary }}>
              <Sparkles size={18} style={{ color: colors.accent }} />
              {t('duo.summary.prefMatches_title')}
            </h3>
            <p className="text-xs mb-3" style={{ color: colors.textMuted }}>
              {t('duo.summary.prefMatches_subtitle')}
            </p>
            <div className="flex flex-wrap gap-2">
              {preferenceMatches.map((topicId) => {
                const labelKey = PREF_TOPIC_LABELS[topicId];
                const label = labelKey ? t(labelKey as Parameters<typeof t>[0]) : topicId;
                return (
                  <span
                    key={topicId}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{
                      background: `${colors.accent}18`,
                      border: `1px solid ${colors.accent}40`,
                      color: colors.accent,
                    }}
                  >
                    <Check size={12} />
                    {label}
                  </span>
                );
              })}
            </div>
          </Card>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card variant="warning" padding="lg" className="mb-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: colors.textPrimary }}>
            <ShieldAlert size={20} className="text-amber-600" />
            {t('duo.summary.safewords')}
          </h3>
          <div className="flex gap-3">
            <div className="flex-1 rounded-xl p-3 text-center" style={{ background: colors.bgCard }}>
              <p className="text-xs mb-1" style={{ color: colors.textMuted }}>{t('duo.you')}</p>
              <p className="font-semibold text-red-500">
                {personalProfile.safeword || t('duo.summary.undefined')}
              </p>
            </div>
            <div className="flex-1 rounded-xl p-3 text-center" style={{ background: colors.bgCard }}>
              <p className="text-xs mb-1" style={{ color: colors.textMuted }}>{partnerName}</p>
              <p className="font-semibold text-red-500">{partnerSafeword}</p>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card variant="default" padding="md" className="mb-4">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="w-full flex items-center justify-between"
          >
            <span className="flex items-center gap-2" style={{ color: colors.textSecondary }}>
              <PenLine size={18} className="text-purple-500" />
              <span className="font-medium">{t('duo.summary.notes.title')}</span>
              <span className="text-xs" style={{ color: colors.textMuted }}>{t('duo.summary.notes.optional')}</span>
            </span>
            {showNotes ? (
              <ChevronUp size={18} style={{ color: colors.textMuted }} />
            ) : (
              <ChevronDown size={18} style={{ color: colors.textMuted }} />
            )}
          </button>

          {showNotes && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3"
            >
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('duo.summary.notes.placeholder')}
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none text-sm resize-none"
                rows={3}
              />
            </motion.div>
          )}
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card
          variant="default"
          padding="lg"
          className="mb-3 !bg-gradient-to-br !from-purple-50 !to-pink-50 !border-purple-100"
        >
          <p className="text-center flex items-center justify-center gap-2" style={{ color: colors.textSecondary }}>
            <MessageCircle size={18} className="text-purple-500" />
            <em>{t('duo.summary.message')}</em>
          </p>
        </Card>

        <Card variant="default" padding="md">
          <p className="text-xs text-center flex items-center justify-center gap-2" style={{ color: colors.textMuted }}>
            <AlertTriangle size={14} className="text-amber-500" />
            {t('duo.summary.reminder')}
          </p>
        </Card>
      </motion.div>
    </motion.div>
  );
}
