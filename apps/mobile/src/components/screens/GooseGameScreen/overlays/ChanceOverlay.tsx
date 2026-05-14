import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Star } from 'lucide-react-native';
import { Overlay } from '../components/Overlay';
import { useTranslation } from '../../../../i18n';

interface ChanceOverlayProps {
  activeName: string;
  onAdvance: () => void;
}

export function ChanceOverlay({ activeName, onAdvance }: ChanceOverlayProps) {
  const { t } = useTranslation();
  return (
    <Overlay color="#b45309">
      <View style={styles.center}>
        <MotiView
          from={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 320 }}
          style={styles.iconWrapper}
        >
          <Star size={56} color="white" fill="white" />
        </MotiView>
        <Text style={styles.title}>{t('gooseGame.chance.title')}</Text>
        <Text style={styles.desc}>{t('gooseGame.chance.desc', { name: activeName })}</Text>
        <Pressable onPress={onAdvance} style={styles.btn}>
          <Text style={styles.btnText}>{t('gooseGame.chance.advance')}</Text>
        </Pressable>
      </View>
    </Overlay>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconWrapper: {
    marginBottom: 12,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 8,
  },
  desc: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 28,
  },
  btn: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
  },
  btnText: {
    color: '#78350f',
    fontWeight: '700',
    fontSize: 16,
  },
});
