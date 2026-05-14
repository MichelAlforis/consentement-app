// V4 divergence: hub des jeux — écran manquant Phase 4, ajouté Phase 7A
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { Dices, Layers, MapPin } from 'lucide-react-native';
import { useNavigationStore, type Screen } from '@ouiclair/core';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../theme/ThemeContext';
import { GameMenuCard } from '../ui';

interface JeuxScreenProps {
  onNavigate?: (screen: Screen) => void;
}

export function JeuxScreen({ onNavigate: propNavigate }: JeuxScreenProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigateTo = useNavigationStore((s) => s.navigateTo);
  const onNavigate = propNavigate ?? navigateTo;
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      testID="screen-jeux"
      contentContainerStyle={{ padding: 20, paddingTop: insets.top + 20, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      <MotiView
        from={{ opacity: 0, translateY: -8 }}
        animate={{ opacity: 1, translateY: 0 }}
        style={{ marginBottom: 24 }}
      >
        <Text style={[styles.h1, { color: colors.textPrimary }]}>
          {t('tabs.games') || 'Jeux'}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {t('jeux.subtitle') || 'Explore et joue avec ton partenaire'}
        </Text>
      </MotiView>

      <View style={{ gap: 14 }}>
        <GameMenuCard
          icon={<Dices size={26} color="#fff" />}
          title={t('jeux.dice.title') || 'Dé des positions'}
          description={t('jeux.dice.desc') || 'Lance le dé et découvre une position aléatoire'}
          tag={t('jeux.available') || 'Disponible'}
          onPress={() => onNavigate('jeu-des')}
          variant="default"
          delay={0}
        />

        <GameMenuCard
          icon={<Layers size={26} color="#fff" />}
          title={t('jeux.cards.title') || 'Jeu de cartes'}
          description={t('jeux.cards.desc') || 'Pioche une carte et explore de nouvelles expériences'}
          tag={t('jeux.premium') || 'Premium'}
          onPress={() => onNavigate('jeu-cartes')}
          variant="premium"
          delay={1}
        />

        <GameMenuCard
          icon={<MapPin size={26} color="#fff" />}
          title={t('jeux.goose.title') || "Jeu de l'oie"}
          description={t('jeux.goose.desc') || 'Un plateau de jeu pour pimenter votre soirée'}
          tag={t('jeux.premium') || 'Premium'}
          onPress={() => onNavigate('jeu-oie')}
          variant="premium"
          delay={2}
        />
      </View>
    </ScrollView>
  );
}

const styles = {
  h1: {
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '800' as const,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
} as const;
