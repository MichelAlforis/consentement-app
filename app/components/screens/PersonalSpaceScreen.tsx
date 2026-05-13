'use client';

import { motion } from 'framer-motion';
import { User, ShieldAlert, Save, Flame } from 'lucide-react';
import { Button, Card, ComfortSlider } from '../ui';
import { ExplicitModeToggle } from '../ui/ExplicitModeToggle';
import { comfortCategories } from '../../data';
import { PersonalProfile } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n';
import { DynamicIcon } from '../../utils/iconFromName';

interface PersonalSpaceScreenProps {
  profile: PersonalProfile;
  onUpdateLevel: (category: 'tenderness' | 'intensity' | 'trust', itemId: string, value: number) => void;
  onUpdateSafeword: (safeword: string) => void;
  onSave: () => void;
}

export function PersonalSpaceScreen({ profile, onUpdateLevel, onUpdateSafeword, onSave }: PersonalSpaceScreenProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5 pb-36">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-start gap-3"
      >
        <User size={28} style={{ color: colors.accent }} className="mt-1 shrink-0" />
        <div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>
            {t('personalSpace.title')}
          </h2>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            {t('personalSpace.subtitle')}
          </p>
        </div>
      </motion.div>

      {(Object.entries(comfortCategories) as [keyof typeof comfortCategories, typeof comfortCategories.tenderness][]).map(
        ([key, category], catIndex) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIndex * 0.15 }}
            className="mb-6"
          >
            <Card variant="elevated" padding="none" className="overflow-hidden">
              <div
                className="p-4"
                style={{
                  background: `linear-gradient(135deg, ${category.color}18 0%, ${category.color}08 100%)`,
                  borderBottom: `1px solid ${colors.divider}`,
                }}
              >
                <div className="flex items-center gap-3">
                  <motion.span whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}>
                    <DynamicIcon name={category.iconName} size={24} color={category.color} />
                  </motion.span>
                  <div>
                    <h3 className="font-semibold" style={{ color: colors.textPrimary }}>
                      {t(`comfort.${key}.title`)}
                    </h3>
                    <p className="text-xs" style={{ color: colors.textSecondary }}>
                      {t(`comfort.${key}.description`)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {category.items.map((item, itemIndex) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: catIndex * 0.15 + itemIndex * 0.05 }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <DynamicIcon name={item.iconName} size={18} color={colors.textMuted} />
                      <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                        {t(`comfort.${key}.items.${item.id}`)}
                      </span>
                    </div>
                    <ComfortSlider
                      value={profile[key][item.id] ?? 0}
                      onChange={(value) => onUpdateLevel(key, item.id, value)}
                    />
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="mb-6"
      >
        <Card variant="elevated" padding="lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Flame size={20} style={{ color: '#ef4444' }} />
              <div>
                <p className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                  {t('settings.explicit.title')}
                </p>
                <p className="text-xs mt-0.5" style={{ color: colors.textMuted }}>
                  {t('settings.explicit.desc')}
                </p>
              </div>
            </div>
            <ExplicitModeToggle pillOnly />
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-6"
      >
        <Card variant="warning" padding="lg">
          <h3 className="font-semibold mb-2 flex items-center gap-2" style={{ color: colors.textPrimary }}>
            <ShieldAlert size={20} style={{ color: colors.warning }} />
            {t('personalSpace.safeword.title')}
          </h3>
          <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
            {t('personalSpace.safeword.desc')}
          </p>
          <input
            type="text"
            placeholder={t('personalSpace.safeword.placeholder')}
            value={profile.safeword}
            onChange={(e) => onUpdateSafeword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 text-base focus:outline-none transition-colors"
            style={{
              background: colors.bgCard,
              borderColor: colors.warning,
              color: colors.textPrimary,
            }}
          />
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="fixed bottom-0 left-0 right-0 p-5"
        style={{ background: `linear-gradient(to top, ${colors.bgPrimary} 60%, transparent)` }}
      >
        <Button onClick={onSave} fullWidth size="lg">
          <Save size={20} />
          {t('personalSpace.saveBtn')}
        </Button>
        <p className="text-xs text-center mt-3" style={{ color: colors.textMuted }}>
          {t('personalSpace.privacy')}
        </p>
      </motion.div>
    </motion.div>
  );
}
