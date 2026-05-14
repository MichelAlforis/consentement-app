// V4 divergence: props supprimées — lecture directe useProfileStore (@ouiclair/core)
// V4 divergence: onSave → updateComfortLevel() + updateSafeword() store, pas de callback parent
// V4 divergence: ComfortSlider + ExplicitModeToggle depuis apps/mobile/src/components/ui/
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { ChevronLeft, User } from 'lucide-react-native';
import {
  useProfileStore,
  useAuthStore,
  useNavigationStore,
  comfortCategories,
} from '@ouiclair/core';
import { useTranslation } from '../../../i18n';
import { useTheme } from '../../../theme/ThemeContext';
import { ComfortSlider } from '../../ui/ComfortSlider';
import { ExplicitModeToggle } from '../../ui/ExplicitModeToggle';

type CategoryKey = 'tenderness' | 'intensity' | 'trust';
const CATEGORIES: CategoryKey[] = ['tenderness', 'intensity', 'trust'];

export function PersonalSpaceScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const goBack = useNavigationStore((s) => s.goBack);
  const personalProfile = useProfileStore((s) => s.personalProfile);
  const updateComfortLevel = useProfileStore((s) => s.updateComfortLevel);
  const updateSafeword = useProfileStore((s) => s.updateSafeword);
  const isAdult = useAuthStore((s) => s.isAdult);

  const [localComfort, setLocalComfort] = useState<Record<CategoryKey, Record<string, number>>>({
    tenderness: { ...personalProfile.tenderness },
    intensity: { ...personalProfile.intensity },
    trust: { ...personalProfile.trust },
  });
  const [safeword, setSafeword] = useState(personalProfile.safeword);

  const setItemValue = (cat: CategoryKey, itemId: string, value: number) => {
    setLocalComfort((prev) => ({
      ...prev,
      [cat]: { ...prev[cat], [itemId]: value },
    }));
  };

  const handleSave = () => {
    CATEGORIES.forEach((cat) => {
      Object.entries(localComfort[cat]).forEach(([itemId, value]) => {
        updateComfortLevel(cat, itemId, value);
      });
    });
    updateSafeword(safeword);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgPrimary, paddingTop: insets.top }}>
      <MotiView
        from={{ opacity: 0, translateY: -8 }}
        animate={{ opacity: 1, translateY: 0 }}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 12,
          gap: 12,
        }}
      >
        <Pressable onPress={goBack} hitSlop={8}>
          <ChevronLeft size={24} color={colors.textPrimary} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 20, fontWeight: '700', color: colors.textPrimary }}>
            {t('personalSpace.title')}
          </Text>
          <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>
            {t('personalSpace.subtitle')}
          </Text>
        </View>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: `${colors.accent}20`,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <User size={20} color={colors.accent} />
        </View>
      </MotiView>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 32 }}
        keyboardShouldPersistTaps="handled"
      >
        {CATEGORIES.map((cat, catIdx) => {
          const category = comfortCategories[cat];
          return (
            <MotiView
              key={cat}
              from={{ opacity: 0, translateY: 12 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 60 + catIdx * 60 }}
              style={{
                backgroundColor: colors.bgCard,
                borderRadius: 16,
                padding: 16,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: colors.divider,
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '700',
                  color: colors.textPrimary,
                  marginBottom: 2,
                }}
              >
                {category.title}
              </Text>
              <Text
                style={{ fontSize: 12, color: colors.textMuted, marginBottom: 12 }}
              >
                {category.description}
              </Text>
              {category.items.map((item) => (
                <View key={item.id} style={{ marginBottom: 12 }}>
                  <Text style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 4 }}>
                    {item.label}
                  </Text>
                  <ComfortSlider
                    value={localComfort[cat][item.id] ?? 0}
                    onChange={(v) => setItemValue(cat, item.id, v)}
                  />
                </View>
              ))}
            </MotiView>
          );
        })}

        <MotiView
          from={{ opacity: 0, translateY: 12 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 240 }}
          style={{
            backgroundColor: colors.bgCard,
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: colors.divider,
          }}
        >
          <Text
            style={{ fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: 12 }}
          >
            {t('personalSpace.safeword')}
          </Text>
          <TextInput
            value={safeword}
            onChangeText={setSafeword}
            placeholder={t('personalSpace.safeword')}
            placeholderTextColor={colors.textMuted}
            style={{
              borderWidth: 1.5,
              borderColor: colors.accent,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
              fontSize: 16,
              fontWeight: '600',
              color: colors.textPrimary,
              backgroundColor: `${colors.accent}10`,
            }}
          />
        </MotiView>

        {isAdult && (
          <MotiView
            from={{ opacity: 0, translateY: 12 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 280 }}
            style={{ marginBottom: 16 }}
          >
            <ExplicitModeToggle />
          </MotiView>
        )}

        <MotiView
          from={{ opacity: 0, translateY: 12 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 320 }}
        >
          <Pressable
            onPress={handleSave}
            style={{
              backgroundColor: colors.accent,
              borderRadius: 16,
              paddingVertical: 16,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>
              {t('personalSpace.save')}
            </Text>
          </Pressable>
        </MotiView>
      </ScrollView>
    </View>
  );
}
