// V4: composant générique RN. Divergences vs V3 : NativeWind className,
//     Moti AnimatePresence (au lieu de framer-motion), gates via
//     hooks @ouiclair/core (isPremiumGated via usePremiumStore),
//     pas de routing interne — consommé via Screen wrapper par module.
// TODO Phase 5 contenu — Ce composant consomme les exports de
// data/fiches-pratiques.ts qui sont des STUBS. Le contenu pédagogique
// réel sera branché via i18n JSON en Phase 5 contenu (parallèle à
// Phase 5C). Pas de modification du composant nécessaire à ce moment-là.
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatePresence, MotiView } from 'moti';
import {
  BookOpen,
  Flame,
  Heart,
  Lock,
  Sparkles,
} from 'lucide-react-native';
import {
  useModuleProgressStore,
  useNavigationStore,
  usePremiumStore,
  type Screen,
} from '@ouiclair/core';
import { useTranslation } from '../../../i18n';
import { useTheme } from '../../../theme/ThemeContext';
import { BackButton } from '../../ui/BackButton';
import type { FichePratiqueItem, FichePratiqueScreenProps } from '../../../types/fiches-pratiques';

// TODO: une fois tous les consommateurs migrés vers types/, supprimer ce re-export.
export type { FichePratiqueItem, FichePratiqueScreenProps };

const SECTION_COLORS = {
  sectionDef: '#3b82f6',
  sectionConsent: '#10b981',
  sectionLoi: '#f59733',
  sectionQuestion: '#8b5cf6',
} as const;

const SECTION_CONTENT_KEYS: Record<keyof typeof SECTION_COLORS, string> = {
  sectionDef: 'definition',
  sectionConsent: 'consentement',
  sectionLoi: 'loi',
  sectionQuestion: 'question',
};

function FicheIcon({ iconName, color, size = 28 }: { iconName: string; color: string; size?: number }) {
  switch (iconName) {
    case 'Heart': return <Heart size={size} color={color} />;
    case 'Flame': return <Flame size={size} color={color} />;
    case 'BookOpen': return <BookOpen size={size} color={color} />;
    default: return <Sparkles size={size} color={color} />;
  }
}

export function FichePratiqueScreen({
  moduleId,
  namespace,
  items,
  onComplete,
  isPremiumGated = false,
}: FichePratiqueScreenProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const markModuleComplete = useModuleProgressStore((s) => s.markModuleComplete);
  const isPremium = usePremiumStore((s) => s.isPremium);
  const navigateTo = useNavigationStore((s) => s.navigateTo);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visited, setVisited] = useState<Set<number>>(() => new Set([0]));
  const [direction, setDirection] = useState<1 | -1>(1);

  const currentItem = items[currentIndex];
  const isLast = currentIndex === items.length - 1;

  function goTo(index: number) {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    setVisited((prev) => new Set([...prev, index]));
  }

  function handleNext() {
    if (isLast) {
      markModuleComplete(moduleId);
      onComplete?.();
    } else {
      goTo(currentIndex + 1);
    }
  }

  function handlePrev() {
    if (currentIndex > 0) goTo(currentIndex - 1);
  }

  if (isPremiumGated && !isPremium) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bgPrimary, paddingTop: insets.top }}>
        <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
          <BackButton onPress={() => navigateTo('apprendre' as Screen)} />
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16 }}>
          <Lock size={48} color={colors.textMuted} />
          <Text style={{ color: colors.textPrimary, fontSize: 18, fontWeight: '600', textAlign: 'center' }}>
            {t('premium.gateMessage')}
          </Text>
          <Pressable
            onPress={() => navigateTo('premium' as Screen)}
            style={{ marginTop: 8, backgroundColor: colors.accent, borderRadius: 12, paddingHorizontal: 28, paddingVertical: 14 }}
          >
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>
              {t('premium.unlockCta')}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgPrimary, paddingTop: insets.top }}>
      {/* Back + Progress pills */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 }}>
        <BackButton onPress={() => navigateTo('apprendre' as Screen)} />
        <View style={{ flex: 1, flexDirection: 'row', gap: 6 }}>
          {items.map((item, index) => (
            <Pressable
              key={item.id}
              onPress={() => goTo(index)}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                backgroundColor: visited.has(index) ? colors.accent : 'transparent',
                borderWidth: visited.has(index) ? 0 : 1,
                borderColor: colors.textMuted,
              }}
            />
          ))}
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <AnimatePresence exitBeforeEnter>
          <MotiView
            key={currentIndex}
            from={{ opacity: 0, translateX: 24 * direction }}
            animate={{ opacity: 1, translateX: 0 }}
            exit={{ opacity: 0, translateX: -24 * direction }}
            transition={{ type: 'timing', duration: 220 }}
          >
            {/* Header fiche */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: colors.accent + '22', alignItems: 'center', justifyContent: 'center' }}>
                <FicheIcon iconName={currentItem.iconName} color={colors.accent} />
              </View>
              <Text style={{ flex: 1, color: colors.textPrimary, fontSize: 22, fontWeight: '700' }}>
                {t(`${namespace}.fiches.${currentIndex}.titre`)}
              </Text>
            </View>

            {/* Sections */}
            {(Object.keys(SECTION_COLORS) as Array<keyof typeof SECTION_COLORS>).map((key) => {
              const contentKey = SECTION_CONTENT_KEYS[key];
              return (
                <View
                  key={key}
                  style={{
                    marginBottom: 14,
                    borderRadius: 12,
                    borderLeftWidth: 4,
                    borderLeftColor: SECTION_COLORS[key],
                    backgroundColor: SECTION_COLORS[key] + '14',
                    padding: 14,
                  }}
                >
                  <Text style={{ color: SECTION_COLORS[key], fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>
                    {t(`ficheSection.${contentKey}`)}
                  </Text>
                  <Text style={{ color: colors.textPrimary, fontSize: 14, lineHeight: 21 }}>
                    {t(`${namespace}.fiches.${currentIndex}.${contentKey}`)}
                  </Text>
                </View>
              );
            })}
          </MotiView>
        </AnimatePresence>
      </ScrollView>

      {/* Footer */}
      <View
        style={{
          flexDirection: 'row',
          gap: 12,
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: Math.max(insets.bottom, 16),
          borderTopWidth: 1,
          borderTopColor: colors.bgSecondary,
        }}
      >
        {currentIndex > 0 && (
          <Pressable
            onPress={handlePrev}
            style={{ flex: 1, borderRadius: 12, borderWidth: 1, borderColor: colors.textMuted, paddingVertical: 14, alignItems: 'center' }}
          >
            <Text style={{ color: colors.textPrimary, fontWeight: '600', fontSize: 15 }}>
              {t('nav.previous')}
            </Text>
          </Pressable>
        )}
        <Pressable
          onPress={handleNext}
          style={{ flex: 1, borderRadius: 12, backgroundColor: colors.accent, paddingVertical: 14, alignItems: 'center' }}
        >
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>
            {isLast ? t('nav.finish') : t('nav.next')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
